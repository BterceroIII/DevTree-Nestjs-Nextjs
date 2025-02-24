import { Injectable } from '@nestjs/common';

@Injectable()
export class NormalizeHandle {
  normalizeHandle(handle: string): string {
    return handle
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') // Reemplaza espacios por guiones
      .replace(/[^\w\-]+/g, '') // Elimina caracteres no alfanuméricos ni guiones
      .replace(/\-\-+/g, '-'); // Reemplaza múltiples guiones por uno solo
  }
}
