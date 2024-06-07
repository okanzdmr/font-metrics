import express from "express";
import {create, Font, FontCollection, } from "fontkit";
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 6000;

class FontMetrics {
  private font: Font;
  private assciiStart = 32;
  private asciiEnd = 126;
  constructor(fontBuffer: Buffer) {
    const fontOrCollection = create(fontBuffer);
    this.font = (fontOrCollection as FontCollection).fonts
      ? (fontOrCollection as FontCollection).fonts[0]
      : (fontOrCollection as Font);
  }

  public static get controlCharWidths(): number[] {
    return Array(32).fill(0);
  }

  private calculateAsciiCharWidths(): number[] {
    const widths: number[] = [];
    for (let charCode = this.assciiStart; charCode <= this.asciiEnd; charCode++) {
      const char = String.fromCharCode(charCode);
      const glyph = this.font.layout(char);
      const advanceWidth = glyph.advanceWidth;
      widths.push(advanceWidth / this.font.unitsPerEm);
    }
    return widths;
  }

  public getMetrics(): { widths: number[]; mean: number; ascent:number, descent:number, lineHeight: number }{
    const asciiCharWidths = this.calculateAsciiCharWidths();
    const sum = asciiCharWidths.reduce((acc, width) => acc + width, 0);
    const mean = sum / asciiCharWidths.length;
    const ascent = this.font.ascent / this.font.unitsPerEm;
    const descent = this.font.descent / this.font.unitsPerEm;
    const lineHeight = ascent - descent;
    const widths =
     FontMetrics.controlCharWidths.concat(asciiCharWidths);
    return { widths, mean, lineHeight, ascent, descent};
  }
}


app.post("/font", (req: express.Request & { body: Buffer }, res) => {
 
  try {
    let fontBuffer: Buffer = Buffer.from([]);
    req.on("data", (chunk) => {
      fontBuffer = Buffer.concat([fontBuffer, chunk]);
    });
    req.on("end", () => {
      const metrics = getFontMetrics(fontBuffer);
      res.json(metrics);
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

function getFontMetrics(fontBuffer: Buffer) {
  const fontMetrics = new FontMetrics(fontBuffer);
  return fontMetrics.getMetrics();
}


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
