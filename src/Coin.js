import Circle from './geometries/Circle';

export default class Coin extends Circle {

	constructor(x, y, size, speed = 10, img) {
		super(x, y, size, speed);
    
		this.img = img;
		this.cellWidth = img.naturalWidth/ this.totalSpritesX;
		this.cellHeight = img.naturalHeight / this.totalSpritesY;
	}

  draw(ctx) {
    ctx.drawImage(this.img, this.x - this.size, this.y - this.size, this.size*2, this.size*2);
  }
	
}