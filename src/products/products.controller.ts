// src/products/products.controller.ts
import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Param,
    Body,
    ParseIntPipe,
    UseGuards,
  } from '@nestjs/common';
  import { ProductsService } from './products.service';
  import { CreateProductDto } from './dto/create-product.dto';
  import { UpdateProductDto } from './dto/update-product.dto';
  import { Roles } from 'src/auth/decorators/roles.decorator';
  import { Role } from 'src/auth/enums/role.enum';
  import { RolesGuard } from 'src/auth/guards/roles.guard';
  import { AuthGuard } from '@nestjs/passport';
  
  @Controller('products')
  export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
  
    @Get()
    getAll() {
      return this.productsService.findAll();
    }
  
    @Get(':id')
    getOne(@Param('id', ParseIntPipe) id: number) {
      return this.productsService.findOne(id);
    }
  
    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    create(@Body() dto: CreateProductDto) {
      return this.productsService.create(dto);
    }
  
    @Patch(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
      return this.productsService.update(id, dto);
    }
  
    @Delete(':id')
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.ADMIN)
    remove(@Param('id', ParseIntPipe) id: number) {
      return this.productsService.remove(id);
    }
  }
  