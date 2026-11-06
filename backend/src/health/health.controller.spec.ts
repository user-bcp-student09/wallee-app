import { Test } from '@nestjs/testing';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  it('reports the service as healthy', async () => {
    const module = await Test.createTestingModule({ controllers: [HealthController] }).compile();

    expect(module.get(HealthController).check()).toEqual({ status: 'ok', service: 'wallee-backend' });
  });
});
