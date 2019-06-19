import {IsDate, IsEmpty, IsNotEmpty, IsNumber, IsString} from "class-validator";
export class TragosUpdateDto{
    @IsEmpty()
    id:number;

    @IsNotEmpty()
    @IsString()
    nombre: string;

    @IsNotEmpty()
    @IsString()
    tipo: 'Ron'|'Vodka'|'Whiskey'|'Tequila'|'Puntas'|'Cervezas';

    @IsNotEmpty()
    @IsNumber()
    gradosAlcohol: number;

    @IsDate()
    fechaCaducidad: Date;

    @IsNumber()
    precio: number;

    @IsNumber()
    distribuidorId: number;
}