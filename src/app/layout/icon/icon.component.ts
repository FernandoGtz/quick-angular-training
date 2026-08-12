import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  viewChild,
} from '@angular/core';

export type LucideNode = readonly [string, Record<string, string | number>];
export type LucideIconData = readonly LucideNode[];

const SVG_NS = 'http://www.w3.org/2000/svg';

/*
 * Reusable icon component.
 * Renders a Lucide icon from its raw SVG node data by creating native SVG
 * elements in the SVG namespace. Importing only the individual icon files
 * that are actually used keeps the development and production bundles small.
 */
@Component({
  selector: 'app-icon',
  standalone: true,
  template: `
    <svg
      #svgEl
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      [attr.stroke-width]="strokeWidth()"
      stroke-linecap="round"
      stroke-linejoin="round"
      [class]="className()"
      xmlns="http://www.w3.org/2000/svg"
    ></svg>
  `,
  styles: [`:host { display: inline-flex; }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IconComponent {
  /* Reference to the rendered <svg> element. */
  private svgEl = viewChild.required<ElementRef<SVGSVGElement>>('svgEl');

  /* Raw icon data imported from a single lucide icon file. */
  icon = input.required<LucideIconData>();

  /* Render size in pixels. */
  size = input<number | string>(24);

  /* Stroke width of the icon strokes. */
  strokeWidth = input<number | string>(2);

  /* CSS classes applied to the svg element. */
  className = input<string>('');

  /* Optional accessible title rendered as a <title> inside the SVG. */
  iconTitle = input<string>('');

  constructor() {
    /* Re-render the icon children whenever any input changes.
     * Using native SVG namespace guarantees the elements are parsed as SVG. */
    effect(() => {
      const svg = this.svgEl().nativeElement;
      this.clearChildren(svg);

      const title = this.iconTitle();
      if (title) {
        const titleEl = document.createElementNS(SVG_NS, 'title');
        titleEl.textContent = title;
        svg.appendChild(titleEl);
      }

      for (const [tag, attrs] of this.icon()) {
        const el = document.createElementNS(SVG_NS, tag);
        for (const [key, value] of Object.entries(attrs)) {
          el.setAttribute(key, String(value));
        }
        svg.appendChild(el);
      }
    });
  }

  /* Removes all child nodes from an SVG element. */
  private clearChildren(svg: SVGSVGElement): void {
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
  }
}
