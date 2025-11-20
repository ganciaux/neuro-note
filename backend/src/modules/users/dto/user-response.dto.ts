import { Expose } from "class-transformer";

export class UserResponseDto {
    @Expose()
    id: number;

    @Expose()
    email: string;

    @Expose()
    fullName: string;

    @Expose()
    roleCode: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;
}