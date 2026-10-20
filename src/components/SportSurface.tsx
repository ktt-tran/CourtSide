import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, G, Line, Path, Rect } from 'react-native-svg';

import { PAINT, surfaceFor, type Surface } from '@/lib/surfaces';
import { palettes, radius, useIsDark } from '@/lib/theme';

type Variant = 'banner' | 'thumb';
// `top` is where markings may start on a banner, so the headline sits on bare surface.
type Draw = (w: number, h: number, s: Surface, v: Variant, top: number) => ReactNode;

// Repeating boards or mowing stripes across the width.
function stripes(w: number, h: number, size: number, color: string) {
  const out: ReactNode[] = [];
  for (let x = size, i = 0; x < w; x += size * 2, i++) {
    out.push(<Rect key={i} x={x} y={0} width={size} height={h} fill={color} />);
  }
  return out;
}

const basketball: Draw = (w, h, s, v, top) => {
  const board = v === 'thumb' ? 8 : 23;
  const seams: ReactNode[] = [];
  for (let x = board, i = 0; x < w; x += board, i++) {
    seams.push(<Line key={i} x1={x} y1={0} x2={x} y2={h} stroke="#C4945A" strokeOpacity={0.45} strokeWidth={1} />);
  }
  if (v === 'thumb') {
    return (
      <>
        {stripes(w, h, board, s.alt)}
        {seams}
        <G stroke={PAINT} strokeWidth={1.6} fill="none">
          <Rect x={6} y={8} width={w - 12} height={h - 16} />
          <Line x1={w / 2} y1={8} x2={w / 2} y2={h - 8} />
          <Circle cx={w / 2} cy={h / 2} r={8} />
          <Rect x={6} y={h / 2 - 9} width={11} height={18} fill={palettes.light.navy} />
          <Rect x={w - 17} y={h / 2 - 9} width={11} height={18} fill={palettes.light.navy} />
        </G>
        <Circle cx={w / 2} cy={h / 2} r={1.6} fill={PAINT} />
      </>
    );
  }
  // The baseline end of a court, seen from above: lane, free-throw circle, three-point arc, all in frame.
  const room = h - top - 30; // keep clear of the banner's rounded bottom
  const arc = Math.min(w * 0.42, room);
  const lane = Math.min(arc * 0.62, 150);
  const ft = Math.min(52, lane * 0.45);
  return (
    <>
      {stripes(w, h, board, s.alt)}
      {seams}
      <G stroke={PAINT} strokeWidth={3} fill="none" strokeOpacity={0.9}>
        <Line x1={16} y1={top} x2={w - 16} y2={top} />
        {arc > 60 ? (
          <>
            <Path d={`M${w / 2 - arc} ${top} A${arc} ${arc} 0 0 0 ${w / 2 + arc} ${top}`} />
            <Rect x={w / 2 - ft} y={top} width={ft * 2} height={lane} fill={palettes.light.navy} fillOpacity={0.88} />
            <Circle cx={w / 2} cy={top + lane} r={ft} />
          </>
        ) : null}
      </G>
    </>
  );
};

const soccer: Draw = (w, h, s, v, top) => {
  const t = v === 'thumb';
  const room = h - top - 30;
  const cy = t ? h / 2 : top + room / 2;
  const r = t ? 9 : Math.min(62, room / 2 - 8);
  const box = t ? { w: 10, h: 26 } : { w: 70, h: Math.min(170, room - 16) };
  return (
    <>
      {stripes(w, h, t ? 8 : 44, s.alt)}
      <G stroke={PAINT} strokeWidth={t ? 1.6 : 3} fill="none" strokeOpacity={0.9}>
        <Rect x={t ? 5 : 14} y={t ? 7 : top} width={t ? w - 10 : w - 28} height={t ? h - 14 : h + 40} />
        <Line x1={w / 2} y1={t ? 7 : top} x2={w / 2} y2={t ? h - 7 : h + 20} />
        {r > 20 ? <Circle cx={w / 2} cy={cy} r={r} /> : null}
        <Rect x={t ? 5 : 14} y={cy - box.h / 2} width={box.w} height={box.h} />
        <Rect x={w - box.w - (t ? 5 : 14)} y={cy - box.h / 2} width={box.w} height={box.h} />
      </G>
      <Circle cx={w / 2} cy={cy} r={t ? 1.6 : 4} fill={PAINT} />
    </>
  );
};

const tennis: Draw = (w, h, s, v, top) => {
  if (v === 'thumb') {
    const x = 11;
    const y = 6;
    const cw = w - 22;
    const ch = h - 12;
    return (
      <>
        <Rect x={x} y={y} width={cw} height={ch} fill={s.alt} />
        <G stroke={PAINT} strokeWidth={1.5} fill="none">
          <Rect x={x} y={y} width={cw} height={ch} />
          <Line x1={x + 5} y1={y} x2={x + 5} y2={y + ch} />
          <Line x1={x + cw - 5} y1={y} x2={x + cw - 5} y2={y + ch} />
          <Line x1={x + 5} y1={y + ch * 0.24} x2={x + cw - 5} y2={y + ch * 0.24} />
          <Line x1={x + 5} y1={y + ch * 0.76} x2={x + cw - 5} y2={y + ch * 0.76} />
          <Line x1={w / 2} y1={y + ch * 0.24} x2={w / 2} y2={y + ch * 0.76} />
        </G>
        <Line x1={x - 3} y1={h / 2} x2={x + cw + 3} y2={h / 2} stroke="#E8EEF2" strokeWidth={2.4} />
      </>
    );
  }
  const x = w * 0.08;
  const cw = w * 0.84;
  const alley = cw * 0.12;
  const service = Math.max(top + 90, h * 0.6);
  return (
    <>
      <Rect x={x} y={top} width={cw} height={h + 40} fill={s.alt} />
      <G stroke={PAINT} strokeWidth={3} fill="none" strokeOpacity={0.9}>
        <Rect x={x} y={top} width={cw} height={h + 40} />
        <Line x1={x + alley} y1={top} x2={x + alley} y2={h + 20} />
        <Line x1={x + cw - alley} y1={top} x2={x + cw - alley} y2={h + 20} />
        <Line x1={x + alley} y1={service} x2={x + cw - alley} y2={service} />
        <Line x1={w / 2} y1={service} x2={w / 2} y2={h + 20} />
        <Line x1={w / 2} y1={top} x2={w / 2} y2={top + 12} />
      </G>
    </>
  );
};

const football: Draw = (w, h, s, v, top) => {
  const t = v === 'thumb';
  const step = t ? 12 : w / 7;
  const lines: ReactNode[] = [];
  for (let x = step / 2, i = 0; x < w; x += step, i++) {
    lines.push(<Line key={`l${i}`} x1={x} y1={t ? 0 : top} x2={x} y2={h} />);
    for (const hy of t ? [h * 0.34, h * 0.66] : [top + (h - top) * 0.3, top + (h - top) * 0.7]) {
      lines.push(<Line key={`h${i}-${hy}`} x1={x + step / 2 - (t ? 1.5 : 5)} y1={hy} x2={x + step / 2 + (t ? 1.5 : 5)} y2={hy} />);
    }
  }
  return (
    <>
      {stripes(w, h, step, s.alt)}
      <G stroke={PAINT} strokeWidth={t ? 1.3 : 2.5} strokeOpacity={0.85}>
        {lines}
      </G>
    </>
  );
};

const baseball: Draw = (w, h, s, v) => {
  const t = v === 'thumb';
  const cx = t ? w / 2 : w * 0.72;
  const cy = t ? h - 7 : h + 8;
  const d = t ? 17 : h * 0.36;
  const diamond = `M${cx} ${cy} L${cx + d} ${cy - d} L${cx} ${cy - 2 * d} L${cx - d} ${cy - d} Z`;
  const inner = d * 0.78;
  const grass = `M${cx} ${cy - d + inner} L${cx + inner} ${cy - d} L${cx} ${cy - d - inner} L${cx - inner} ${cy - d} Z`;
  const base = t ? 3 : 9;
  return (
    <>
      {stripes(w, h, t ? 8 : 40, '#3A7443')}
      <Circle cx={cx} cy={cy - d} r={d * 1.42} fill={s.alt} />
      <Path d={grass} fill={s.base} />
      <Circle cx={cx} cy={cy - d} r={d * 0.17} fill={s.alt} />
      <G stroke={PAINT} strokeWidth={t ? 1.4 : 3} strokeOpacity={0.9} fill="none">
        <Path d={diamond} />
        <Line x1={cx} y1={cy} x2={cx + 3 * d} y2={cy - 3 * d} />
        <Line x1={cx} y1={cy} x2={cx - 3 * d} y2={cy - 3 * d} />
      </G>
      {[
        [cx + d, cy - d],
        [cx, cy - 2 * d],
        [cx - d, cy - d],
        [cx, cy],
      ].map(([bx, by], i) => (
        <Path key={i} d={`M${bx} ${by - base / 1.4} L${bx + base / 1.4} ${by} L${bx} ${by + base / 1.4} L${bx - base / 1.4} ${by} Z`} fill={PAINT} />
      ))}
    </>
  );
};

const other: Draw = (w, h, s, v, top) => {
  const t = v === 'thumb';
  const room = h - top - 30;
  const cy = t ? h / 2 : top + room / 2;
  const r = t ? 9 : Math.min(54, room / 2 - 8);
  return (
    <>
      <G stroke={PAINT} strokeWidth={t ? 1.5 : 3} fill="none" strokeOpacity={0.75}>
        <Rect x={t ? 7 : 16} y={t ? 7 : top} width={t ? w - 14 : w - 32} height={t ? h - 14 : h + 20} />
        <Line x1={w / 2} y1={t ? 7 : top} x2={w / 2} y2={h + 20} />
        {r > 20 || t ? <Circle cx={w / 2} cy={cy} r={r} /> : null}
      </G>
      <Circle cx={w / 2} cy={cy} r={t ? 1.6 : 4} fill={PAINT} />
    </>
  );
};

const DRAW: Record<string, Draw> = { basketball, soccer, tennis, football, baseball, other };

// The painted play area for a sport, filling its parent. Banners get the full court; thumbs a whole small one.
export function SportSurface({
  sport,
  width,
  height,
  variant = 'banner',
  top = 0,
}: {
  sport: string;
  width: number;
  height: number;
  variant?: Variant;
  top?: number;
}) {
  const dark = useIsDark();
  if (width <= 0 || height <= 0) return null;
  const surface = surfaceFor(sport);
  const draw = DRAW[sport] ?? other;
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={StyleSheet.absoluteFill}>
      <Rect x={0} y={0} width={width} height={height} fill={surface.base} />
      {draw(width, height, surface, variant, top)}
      {/* After dusk: the surface dims, the paint stays readable. */}
      {dark ? <Rect x={0} y={0} width={width} height={height} fill="#0B0D12" opacity={0.4} /> : null}
    </Svg>
  );
}

// A small rounded tile of a sport's court, used on cards and in the sport picker.
export function SportThumb({ sport, size = 64, style }: { sport: string; size?: number; style?: StyleProp<ViewStyle> }) {
  return (
    <View
      style={[{ width: size, height: size, borderRadius: radius.md, overflow: 'hidden' }, style]}
      accessible={false}>
      <SportSurface sport={sport} width={size} height={size} variant="thumb" />
    </View>
  );
}
