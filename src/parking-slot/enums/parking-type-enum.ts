// Adding a suffix of enum as to not confused with
// ParkingType that is available in @prisma/client
// Also the ParkingType that @prisma/client created
// is not enum but is of type `type`
export enum ParkingTypeEnum {
  SP = 'SP',
  MP = 'MP',
  LP = 'LP',
}
