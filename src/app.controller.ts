/* eslint-disable prettier/prettier */
import { Body, Controller, Get, HttpCode, Post, Render, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { RegistrationDto } from './registration.dto';
import { User } from './user';
import { Response } from 'express';
import { Product } from './product';

const users: User[] = [new User('admin@gmail.com','12345678',21)];
const products: Product[] = [new Product('CC2233','perfect','Valami3')];

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  index() {
    return { message: 'Welcome to the homepage' };
  }

  @Get('register')
  @Render('registerForm')
  registerForm() {
    return { errors: []};
  }

  @Post('register')
  @HttpCode(200)
  @Render('registerForm')
  register(@Body() registration: RegistrationDto, @Res() res: Response) {
    const errors : string[] = [];
    if(!registration.email.includes('@')) {
      errors.push('Az email cím formátuma nem megfelelő')
    }
    if(registration.password.length < 8) {
      errors.push('A jelszónak legalább 8 karakterből kell állnia')
    }
    if(registration.password != registration.password_again) {
      errors.push('A két jelszó nem egyezik')
    }
    const age = parseInt(registration.age);
    if(age < 18 || isNaN(age)) {
      errors.push('Azéletkor 18-nál nagyobbnak kell, hogy legyen')
    }
    if(errors.length > 0) {
      return {errors};
    }
    else{
      users.push(new User(registration.email,registration.password,age))
      console.log(users);
      res.redirect('/');
    }
  }

  @Get('product')
  @Render('productForm')
  productForm() {
    console.log(products);
    return{
      errors: [],
      products,
      serial: '',
      name: '',
    };
  }

  @Post('product')
  @HttpCode(200)
  @Render('productForm')
  productAdd(@Body() product: Product, @Res() res: Response) {
    const errors: string[] = []; 
    let serial: string = product.serial;
    let name: string = product.name;
    if(!/^[a-zA-Z]{2}[0-9]{4}$/gm.test(serial)){
      errors.push('Wrong serial nuber format!');
      serial = '';
    }
    if(name.length < 3){
      errors.push('The name must be 3 charaters or more!');
      name = '';
    }
    if(errors.length > 0){
      return {errors, products, name, serial}
    }
    else{
      products.push(new Product(product.serial.toUpperCase(),product.condition,product.name));
      console.log(products);
      res.redirect('/product');
      return {products, name: '', serial: ''};
    }
  }
}
