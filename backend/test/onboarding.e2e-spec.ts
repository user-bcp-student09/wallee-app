// backend/test/onboarding.e2e-spec.ts
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';

type Step = {
  key?: string;
  stepKey?: string;
};

describe('W1 onboarding guiado', () => {
  let app: INestApplication;
  let syntheticPhoneCounter = 1;

  const nextSyntheticPhone = (): string => {
    const suffix = String(syntheticPhoneCounter++).padStart(8, '0');
    return `9${suffix}`;
  };

  const createOnboarding = async (): Promise<{
    onboardingId: string;
    walletId: string;
    phone: string;
  }> => {
    const phone = nextSyntheticPhone();

    const response = await request(app.getHttpServer())
      .post('/onboarding')
      .send({});

    expect(response.status).toBe(201);
    expect(response.body.onboardingId).toBeTruthy();
    expect(response.body.walletId).toBeTruthy();

    return {
      onboardingId: response.body.onboardingId as string,
      walletId: response.body.walletId as string,
      phone,
    };
  };

  const submitStep = (
    onboardingId: string,
    stepKey: string,
    body: Record<string, unknown>,
  ) =>
    request(app.getHttpServer())
      .put(`/onboarding/${onboardingId}/steps/${stepKey}`)
      .send(body);

  const getCurrentStep = async (onboardingId: string): Promise<unknown> => {
    const response = await request(app.getHttpServer())
      .get(`/onboarding/${onboardingId}`);

    expect(response.status).toBe(200);
    return response.body.currentStep;
  };

  const expectValidationErrorForField = (
    body: Record<string, unknown>,
    field: string,
  ): void => {
    expect(body.code).toBe('VALIDATION_ERROR');
    expect(JSON.stringify(body).toLowerCase()).toContain(field.toLowerCase());
  };

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it('W1-AC1-T2 [EP/ST] muestra los pasos requeridos y el paso actual', async () => {
    const { onboardingId } = await createOnboarding();

    const response = await request(app.getHttpServer())
      .get(`/onboarding/${onboardingId}`);

    expect(response.status).toBe(200);
    expect(response.body.currentStep).toBe('datos');
    expect(Array.isArray(response.body.steps)).toBe(true);
    expect(response.body.steps).toHaveLength(3);

    const steps = response.body.steps as Step[];
    const keys = steps.map((step) => step.key ?? step.stepKey);

    expect(keys).toEqual(['datos', 'identidad', 'verificacion']);
  });

  it('W1-AC1-T2 [ST] marca el siguiente paso como actual tras completar datos', async () => {
    const { onboardingId, phone } = await createOnboarding();

    const response = await submitStep(onboardingId, 'datos', {
      name: 'Usuario Sintetico',
      phone,
    });

    expect(response.status).toBe(200);
    expect(response.body.currentStep).toBe('identidad');
  });

  it('W1-AC1-T3 [ST] rechaza un paso enviado fuera de orden', async () => {
    const { onboardingId } = await createOnboarding();

    const response = await submitStep(onboardingId, 'verificacion', {
      code: '123456',
    });

    expect(response.status).toBe(409);
    expect(response.body.code).toBe('STEP_OUT_OF_ORDER');
    await expect(getCurrentStep(onboardingId)).resolves.toBe('datos');
  });

  it('W1-AC2-T2 [EP] bloquea el avance cuando falta el nombre obligatorio', async () => {
    const { onboardingId, phone } = await createOnboarding();

    const response = await submitStep(onboardingId, 'datos', {
      name: '',
      phone,
    });

    expect(response.status).toBe(400);
    expectValidationErrorForField(response.body, 'name');
    await expect(getCurrentStep(onboardingId)).resolves.toBe('datos');
  });

  it.each([
    ['8 dígitos', '91234567'],
    ['10 dígitos', '9123456780'],
    ['9 dígitos con prefijo distinto de 9', '812345678'],
  ])(
    'W1-AC2-T3 [BVA] rechaza celular de %s',
    async (_description, invalidPhone) => {
      const { onboardingId } = await createOnboarding();

      const response = await submitStep(onboardingId, 'datos', {
        name: 'Usuario Sintetico',
        phone: invalidPhone,
      });

      expect(response.status).toBe(400);
      expectValidationErrorForField(response.body, 'phone');
      await expect(getCurrentStep(onboardingId)).resolves.toBe('datos');
    },
  );

  it.each([
    ['7 dígitos', '1234567'],
    ['9 dígitos', '123456789'],
  ])(
    'W1-AC2-T2 [BVA] rechaza documento de %s',
    async (_description, document) => {
      const { onboardingId, phone } = await createOnboarding();

      const datosResponse = await submitStep(onboardingId, 'datos', {
        name: 'Usuario Sintetico',
        phone,
      });
      expect(datosResponse.status).toBe(200);

      const response = await submitStep(onboardingId, 'identidad', {
        document,
      });

      expect(response.status).toBe(400);
      expectValidationErrorForField(response.body, 'document');
      await expect(getCurrentStep(onboardingId)).resolves.toBe('identidad');
    },
  );

  it('W1-AC2-T2 [EP] permite reintentar OTP incorrecto sin avanzar', async () => {
    const { onboardingId, phone } = await createOnboarding();

    const datosResponse = await submitStep(onboardingId, 'datos', {
      name: 'Usuario Sintetico',
      phone,
    });
    expect(datosResponse.status).toBe(200);

    const identidadResponse = await submitStep(onboardingId, 'identidad', {
      document: '12345678',
    });
    expect(identidadResponse.status).toBe(200);

    const response = await submitStep(onboardingId, 'verificacion', {
      code: '000000',
    });

    expect(response.status).toBe(400);
    expectValidationErrorForField(response.body, 'code');
    await expect(getCurrentStep(onboardingId)).resolves.toBe('verificacion');
  });

  it.each([
    ["cadena tipo SQL", "' OR 1=1--"],
    ["cadena tipo JavaScript", '<script>alert(1)</script>'],
    ['unicode y espacios', ' ９１２３４５６７８ '],
    ['cadena desmesuradamente larga', `9${'1'.repeat(10000)}`],
  ])(
    'W1-AC2-T3 [EG/SEC-05] rechaza celular hostil: %s',
    async (_description, hostilePhone) => {
      const { onboardingId } = await createOnboarding();

      const response = await submitStep(onboardingId, 'datos', {
        name: 'Usuario Sintetico',
        phone: hostilePhone,
      });

      expect(response.status).toBe(400);
      expectValidationErrorForField(response.body, 'phone');
      await expect(getCurrentStep(onboardingId)).resolves.toBe('datos');
    },
  );

  it('W1-AC3-T2 [ST] activa la wallet al completar los tres pasos', async () => {
    const { onboardingId, walletId, phone } = await createOnboarding();

    const datosResponse = await submitStep(onboardingId, 'datos', {
      name: 'Usuario Sintetico',
      phone,
    });
    expect(datosResponse.status).toBe(200);

    const identidadResponse = await submitStep(onboardingId, 'identidad', {
      document: '12345678',
    });
    expect(identidadResponse.status).toBe(200);

    const verificacionResponse = await submitStep(onboardingId, 'verificacion', {
      code: '123456',
    });
    expect(verificacionResponse.status).toBe(200);

    const walletResponse = await request(app.getHttpServer())
      .get(`/wallets/${walletId}`);

    expect(walletResponse.status).toBe(200);
    expect(walletResponse.body.status).toBe('ACTIVA');
  });

  it('W1-AC3-T3 [ST] conserva pendiente la wallet antes de terminar el onboarding', async () => {
    const { walletId } = await createOnboarding();

    const walletResponse = await request(app.getHttpServer())
      .get(`/wallets/${walletId}`);

    expect(walletResponse.status).toBe(200);
    expect(walletResponse.body.status).toBe('PENDIENTE_ONBOARDING');
  });
});
