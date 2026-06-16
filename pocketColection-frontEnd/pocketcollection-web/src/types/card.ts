export interface Card {
  id: number;
  tcgdex_id: string;
  numero: string;
  nombre_en: string;
  rareza: string | null;
  imagen_url: string;
  set_nombre: string;
}