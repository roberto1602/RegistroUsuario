import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { RegistroUsuarioService } from '../../services/registro-usuario.service';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {
listUser: any[] = [];
form!: FormGroup;
idUsuario: number | undefined;
accion = 'Agregar';
idNumber: number | undefined;

constructor(
  private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private usuarioService:RegistroUsuarioService){
}


ngOnInit():void{
  this.obtenerUsuarios();
}

actualizarUsuario(usuario: any) {
  this.accion = 'Editar';
  this.idNumber = usuario.idNumber;

  this.form.patchValue({
    usuario_id: usuario.usuario_id,
    numero_identificacion: usuario.numero_identificacion,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    nombre_usuario: usuario.nombre_usuario,
    correo:  usuario.correo,
    telefono:  usuario.telefono,
    direccion:  usuario.direccion,
    genero:  usuario.genero,
    estado:  usuario.estado,
    contrasena:  usuario.contrasena,
    activo:  usuario.activo
  });
}


guardarUsuario() {
  const usuario: any = {
    usuario_id: this.form.get('usuario_id')?.value,
    numero_identificacion: this.form.get('numero_identificacion')?.value,
    nombre: this.form.get('nombre')?.value,
    apellido: this.form.get('apellido')?.value,
    nombre_usuario: this.form.get('nombre_usuario')?.value,
    correo: this.form.get('correo')?.value,
    telefono: this.form.get('telefono')?.value,
    direccion: this.form.get('direccion')?.value,
    genero: this.form.get('genero')?.value,
    estado: this.form.get('estado')?.value,
    contrasena: this.form.get('contrasena')?.value,
    activo: this.form.get('activo')?.value
  };
  
  if (this.idNumber == undefined) {
    this.usuarioService.saveUsuario(usuario).pipe(
      catchError((error) => {
        console.log(error);
        return this.throwError(error);
      })
    ).subscribe(data => {
      this.toastr.success('Usuario fue registrado con exito!','usuario registrado!');
      this.obtenerUsuarios();
      this.form.reset();
    })
  }
  else{
    let usuario: any = {}; 
    usuario.idUsuario = this.idUsuario;
    this.usuarioService.updateUsuario(this.idNumber, usuario).pipe(
      catchError((error) => {
        console.log(error);
        return this.throwError(error);
      })
    ).subscribe(data => {
      this.form.reset();
      this.accion = 'Agregar';
      this.idUsuario = undefined;
      this.toastr.info('Usuario fue actualizada con exito!',
      'usuario registrado!');
      this.obtenerUsuarios();
    })
  }
}

obtenerUsuarios() {
  this.usuarioService
    .getListaUsuarios()
    .pipe(
      catchError((error) => {
        console.log(error);
        return this.throwError(error);
      })
    ).subscribe((data) => {
      console.log(data);
      this.listUser = data;
    });
}

eliminarUsuario(idUsuario: number) {
  if (idUsuario !== undefined) {
    this.usuarioService.deleteUsuario(idUsuario).subscribe((data) => {
      this.toastr.error(
        'Usuario eliminado con éxito!'
      );
      this.obtenerUsuarios();
    });
  } else {
    this.toastr.error('ID de usuario inválido', 'Error');
  }
  console.log(idUsuario);
}

throwError(error: any): any {
  if (error.status === 404) {
    console.log('El usuario no existe');
    return 'Usuario no encontrado';
  } else if (error.status === 500) {
    console.log('Error interno del servidor');
    return 'Error interno del servidor';
  } else {
    console.log('Error no identificado:', error);
    return 'Opsss... ocurrio un error';
  }
}

}
