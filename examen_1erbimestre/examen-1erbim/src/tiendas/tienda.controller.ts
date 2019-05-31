import {Controller, Get, Response, Request, Headers, Post, Body, Res} from '@nestjs/common';
import {Tiendas} from "./interfacestiendas/tiendas";
import {isEmpty} from "@nestjs/common/utils/shared.utils";
import {TiendaService} from "./tienda.service";
import {Productos} from "../productos/interfaces/productos";

@Controller('/examen')
export class TiendaController {
    constructor(private readonly tiendaService: TiendaService) {
    }
    @Post('/login')
    loginCookie1(@Headers() headers, @Request() request, @Response() response, @Body('nombre') nombre: string) {
        const cookieSeg = request.signedCookies;
        if (!cookieSeg.nombreUsuario) {

            response.cookie('nombreUsuario', nombre,{signed: true});
            cookieSeg.nombreUsuario=nombre;


        }
        if (cookieSeg.nombreUsuario) {

            response.redirect('/examen/bienvenido')
        }
        else{
            return response.redirect('/examen/inicioSesion');
        }

    }
    @Get('/gestionarTiendas')
    gestionarTiendas(@Request() request, @Response() response) {
        const cookieSeg = request.signedCookies;
        const arregloTiendas = this.tiendaService.bddTiendas;
        if (cookieSeg.nombreUsuario) {
            return response.render('Tiendas/gestiontiendas',{arregloTiendas:arregloTiendas,nombre:cookieSeg.nombreUsuario})
        } else {
            return response.redirect('/examen/inicioSesion');
        }


    }


    @Get('/gestionTiendas')
    gestionarTiendas1(@Headers() headers, @Request() request, @Response() response) {
        const cookieSeg = request.signedCookies;

        if (cookieSeg.nombreUsuario) {

            return response.render('Tiendas/gestiontiendas',{arregloTiendas:arregloTiendaBusqueda,nombre:cookieSeg.nombreUsuario})
        }
        else{
            return response.redirect('/examen/inicioSesion');
        }




    }@Post('/borrarCookie')
    borrarCookiemethod(@Headers() headers, @Request() request, @Response() response, @Body('nombre') nombre: string) {
        response.clearCookie("nombreUsuario");
        response.redirect('/examen/inicioSesion')
    }

    @Get('/inicioSesion')
    inicioSesion(@Response() res){
        return res.render('login')
    }
    @Get('/gestion')
    gestion(@Response() res, @Request() request){
        const cookieSeg = request.signedCookies;
        if (cookieSeg.nombreUsuario) {

            res.redirect('/examen/gestionarTiendas')
        }
        else{
            return res.redirect('/examen/inicioSesion');
        }
    }

    @Get('/bienvenido')
    bienvenido(@Response() res,  @Request() request){
        const cookieSeg = request.signedCookies;

        if (cookieSeg.nombreUsuario) {

            return res.render('paginaprincipal',{
                nombre:cookieSeg.nombreUsuario
            })
        }
        else{
            return res.redirect('/examen/inicioSesion');
        }


    }
    @Get('/crearTienda')
    crearTienda( @Res() res,@Request() request){
        const cookieSeg = request.signedCookies;

        if (cookieSeg.nombreUsuario) {

            return res.render('Tiendas/crearTienda',{
                nombre:cookieSeg.nombreUsuario
            })
        }
        else{
            return res.redirect('/examen/inicioSesion');
        }


    }
    @Post('/crearTienda')
    crearTiendaPost(
        @Body() tienda:Tiendas,
        @Res() res,
        @Request() request
    ){
        const cookieSeg = request.signedCookies;
        tienda.RUC=Number(tienda.RUC);

        tienda.fechaApertura =new Date(tienda.fechaApertura);
        tienda.matriz= Boolean(tienda.matriz);
        console.log(tienda);
        this.tiendaService.crearTienda(tienda);
        if (cookieSeg.nombreUsuario) {

            res.redirect('/examen/gestionarTiendas');
        }
        else{
            return res.redirect('/examen/inicioSesion');
        }

    }


    @Post('eliminar')
    eliminarTienda(@Res() res,
                   @Body('id') id: number, @Request() request) {
        const cookieSeg = request.signedCookies;
        this.tiendaService.eliminarPorId(Number(id));
        if (cookieSeg.nombreUsuario) {

            res.redirect('/examen/gestionarTiendas');
        }
        else{
            return res.redirect('/examen/inicioSesion');
        }

    }


    @Post('/buscarTienda')
    buscarTienda(@Res() res,
                 @Body('busquedaTiendas') busquedaTiendas: string, @Request() request) {
        const cookieSeg = request.signedCookies;
        arregloTiendaBusqueda=this.tiendaService.buscarPorNombre(busquedaTiendas);
        console.log('impiendo arreglo tiendas:',arregloTiendaBusqueda);
        if(busquedaTiendas!=null){
            if (cookieSeg.nombreUsuario) {
                res.redirect('/examen/gestionTiendas');
            }
            else{
                return res.redirect('/examen/inicioSesion');
            }

        }else {
            if (cookieSeg.nombreUsuario) {

                res.redirect('/examen/gestionTiendas');
            }
            else{
                return res.redirect('/examen/inicioSesion');
            }

        }
    }

}
let arregloTiendaBusqueda:Tiendas[];