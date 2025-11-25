import { registerDecorator, validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export function FilterField(options: { operators: FilterOperator[]; rules: PropertyDecorator[] }) {
  return function (target: any, propertyKey: string) {
    // Stocke les opérateurs comme avant
    Reflect.defineMetadata('filter:operators', options.operators, target, propertyKey);

    // Stocke les règles
    Reflect.defineMetadata('filter:rules', options.rules, target, propertyKey);

    // Ajoute la validation dynamique
    registerDecorator({
      name: 'FilterField',
      target: target.constructor,
      propertyName: propertyKey,
      constraints: [],
      validator: {
        validate(value: any) {
          if (!value || typeof value !== 'object') return false;

          // wrapper pour appliquer dynamiquement les règles
          class Wrapper {
            value: any;
          }

          for (const rule of options.rules) {
            rule(Wrapper.prototype, 'value');
          }

          // On ne valide que "value"
          const inst = plainToInstance(Wrapper, { value: value.value });

          const errors = validateSync(inst, {
            whitelist: true,
            forbidNonWhitelisted: true,
          });

          return errors.length === 0;
        },
        defaultMessage: () => `Invalid value for filter '${String(propertyKey)}'`,
      },
    });
  };
}
