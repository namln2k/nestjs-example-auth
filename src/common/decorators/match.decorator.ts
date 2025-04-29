import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export function Match(property: string, validationOptions?: ValidationOptions) {
  return (object: Record<string, any>, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints as string[];
    const relatedValue: unknown =
      typeof args.object === 'object' && args.object !== null
        ? (args.object as Record<string, unknown>)[relatedPropertyName]
        : undefined;
    return value === relatedValue;
  }
  defaultMessage(args: ValidationArguments) {
    return args.property + ' must match ' + args.constraints[0];
  }
}
