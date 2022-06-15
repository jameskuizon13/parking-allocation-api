// Adding a suffix of enum as to not confused with
// VehicleType that is available in @prisma/client
// Also the VehicleType that @prisma/client created
// is not enum but is of type `type`
export enum VehicleTypeEnum {
  S = 'S',
  M = 'M',
  L = 'L',
}
