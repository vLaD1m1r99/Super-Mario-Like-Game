import { Subject, fromEvent } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class YouWon {
  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;
  private inYouWon: boolean;
  private bgImage: HTMLImageElement;
  private buttonImage: HTMLImageElement;
  private mouseMove$ = new Subject<MouseEvent>();
  private click$ = new Subject<MouseEvent>();

  private buttonDimensions: { width: number; height: number };
  private buttonPosition: { x: number; y: number };
  // Because png is not clean
  private buttonOffsets: {
    x: number;
    y: number;
  };
  constructor(
    canvas: HTMLCanvasElement,
    bgImage: HTMLImageElement,
    buttonImage: HTMLImageElement
  ) {
    this.ctx = canvas.getContext('2d');
    this.canvas = canvas;
    this.inYouWon = false;
    this.bgImage = bgImage;
    this.buttonImage = buttonImage;
    this.buttonDimensions = {
      width: 375,
      height: 250,
    };
    this.buttonPosition = {
      x: (this.canvas.width - this.buttonDimensions.width) / 2,
      y: this.canvas.height - 300,
    };
    // Because png is not clean
    this.buttonOffsets = {
      x: 100,
      y: -100,
    };

    fromEvent<MouseEvent>(this.canvas, 'mousemove')
      .pipe(takeUntil(this.mouseMove$))
      .subscribe((event) => this.handleYouWonMouseMove(event));

    fromEvent<MouseEvent>(this.canvas, 'click')
      .pipe(takeUntil(this.click$))
      .subscribe((event) => this.handleYouWonClick(event));

    this.drawYouWon();
  }
  // Draw bg
  drawYouWon() {
    this.ctx.drawImage(
      this.bgImage,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    // Draw text
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'italic 72px Shrikhand, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(
      'You Won',
      this.canvas.width / 2,
      this.canvas.height - 400
    );
    // Draw button
    this.ctx.drawImage(
      this.buttonImage,
      this.buttonPosition.x,
      this.buttonPosition.y,
      this.buttonDimensions.width,
      this.buttonDimensions.height
    );
  }

  private handleYouWonClick(event: MouseEvent) {
    const { offsetX, offsetY } = event;

    const { x, y } = this.buttonPosition;
    const { width, height } = this.buttonDimensions;
    const { x: xOffset, y: yOffset } = this.buttonOffsets;
    if (
      offsetX >= x + xOffset &&
      offsetX <= x + width - xOffset &&
      offsetY >= y - yOffset &&
      offsetY <= y + height + yOffset
    ) {
      this.inYouWon = false;
    }
  }

  private handleYouWonMouseMove(event: MouseEvent) {
    const { offsetX, offsetY } = event;

    const { x, y } = this.buttonPosition;
    const { width, height } = this.buttonDimensions;
    const { x: xOffset, y: yOffset } = this.buttonOffsets;
    if (
      offsetX >= x + xOffset &&
      offsetX <= x + width - xOffset &&
      offsetY >= y - yOffset &&
      offsetY <= y + height + yOffset
    ) {
      this.canvas.style.cursor = 'pointer';
    } else {
      this.canvas.style.cursor = 'default';
    }
  }

  setInYouWon = () => {
    this.inYouWon = true;
  };
  getInYouWon = () => {
    return this.inYouWon;
  };
}
