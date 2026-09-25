# Makes logo backgrounds transparent and rescales them for the grid band.
# Usage: powershell -File tools\logo-cutout.ps1 <in> <out> <mode> <longest> [cropX cropY cropW cropH]
#   dark-global   black background anywhere -> clear (white/grey marks)
#   dark-flood    only black connected to the edge -> clear (keeps enclosed colour)
#   light-global  white background -> clear, dark ink -> white
#   light-warm    like light-global but keeps warm colours (gold, red)
#   falcon        dark surround + white disc -> clear, black ink -> white, red kept
param([string]$In, [string]$Out, [string]$Mode, [int]$Longest = 480, [int]$Cx = 0, [int]$Cy = 0, [int]$Cw = 0, [int]$Ch = 0)
Add-Type -AssemblyName System.Drawing
Add-Type -ReferencedAssemblies System.Drawing -TypeDefinition @"
using System; using System.Drawing; using System.Drawing.Imaging; using System.Drawing.Drawing2D; using System.Collections.Generic; using System.Runtime.InteropServices;
public static class Cutout {
  static float Sat(int r, int g, int b) { int mx = Math.Max(r, Math.Max(g, b)), mn = Math.Min(r, Math.Min(g, b)); return mx == 0 ? 0 : (mx - mn) / (float)mx; }
  public static string Run(string inPath, string outPath, string mode, int longest, int cx, int cy, int cw, int ch) {
    using (var s = new Bitmap(inPath)) {
      var crop = cw > 0 ? new Rectangle(cx, cy, cw, ch) : new Rectangle(0, 0, s.Width, s.Height);
      double k = (double)longest / Math.Max(crop.Width, crop.Height);
      int w = (int)Math.Round(crop.Width * k), h = (int)Math.Round(crop.Height * k);
      using (var b = new Bitmap(w, h, PixelFormat.Format32bppArgb)) {
        using (var g = Graphics.FromImage(b)) {
          g.InterpolationMode = InterpolationMode.HighQualityBicubic; g.PixelOffsetMode = PixelOffsetMode.HighQuality;
          g.DrawImage(s, new Rectangle(0, 0, w, h), crop, GraphicsUnit.Pixel);
        }
        var d = b.LockBits(new Rectangle(0, 0, w, h), ImageLockMode.ReadWrite, PixelFormat.Format32bppArgb);
        var px = new byte[w * h * 4]; Marshal.Copy(d.Scan0, px, 0, px.Length);
        var bg = new bool[w * h];
        if (mode == "dark-flood" || mode == "falcon") {
          var q = new Queue<int>();
          for (int x = 0; x < w; x++) { q.Enqueue(x); q.Enqueue((h - 1) * w + x); }
          for (int y = 0; y < h; y++) { q.Enqueue(y * w); q.Enqueue(y * w + w - 1); }
          while (q.Count > 0) {
            int i = q.Dequeue(); if (bg[i]) continue; int o = i * 4;
            if (Math.Max(px[o], Math.Max(px[o + 1], px[o + 2])) > 110) continue;
            bg[i] = true; int x = i % w, y = i / w;
            if (x > 0) q.Enqueue(i - 1); if (x < w - 1) q.Enqueue(i + 1); if (y > 0) q.Enqueue(i - w); if (y < h - 1) q.Enqueue(i + w);
          }
        }
        if (mode == "falcon") {
          double mx0 = w / 2.0, my0 = h / 2.0, R = 1e9;
          for (int i = 0; i < w * h; i++) if (bg[i]) { double dd = Math.Sqrt(Math.Pow(i % w - mx0, 2) + Math.Pow(i / w - my0, 2)); if (dd < R) R = dd; }
          for (int i = 0; i < w * h; i++) if (Math.Sqrt(Math.Pow(i % w - mx0, 2) + Math.Pow(i / w - my0, 2)) > R - 4) bg[i] = true;
        }
        for (int i = 0; i < w * h; i++) {
          int o = i * 4; int B = px[o], G = px[o + 1], R = px[o + 2];
          int mx = Math.Max(R, Math.Max(G, B)), mn = Math.Min(R, Math.Min(G, B)); double a = 1;
          if (mode == "dark-global" || (mode == "dark-flood" && bg[i])) {
            a = Math.Min(1, Math.Max(0, (mx - 28) / 150.0));
            if (a > 0) { R = Math.Min(255, (int)(R / Math.Max(a, 0.01) * 0.9)); G = Math.Min(255, (int)(G / Math.Max(a, 0.01) * 0.9)); B = Math.Min(255, (int)(B / Math.Max(a, 0.01) * 0.9)); }
          } else if (mode == "falcon" && bg[i]) {
            a = 0;
          } else if (mode == "light-global" || mode == "light-warm" || mode == "falcon") {
            bool warm = (mode != "light-global") && Sat(R, G, B) > 0.22 && R > B + 30 && R >= G - 10;
            if (warm) a = Math.Min(1, (255 - mn) / 150.0);
            else { a = Math.Min(1, Math.Max(0, (235 - mn) / 190.0)); R = G = B = 240; }
          }
          px[o] = (byte)B; px[o + 1] = (byte)G; px[o + 2] = (byte)R; px[o + 3] = (byte)Math.Round(a * 255);
        }
        Marshal.Copy(px, 0, d.Scan0, px.Length); b.UnlockBits(d);
        int x0 = w, y0 = h, x1 = 0, y1 = 0;
        for (int i = 0; i < w * h; i++) if (px[i * 4 + 3] > 12) { int x = i % w, y = i / w; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
        int pad = (int)(Math.Max(x1 - x0, y1 - y0) * 0.04);
        x0 = Math.Max(0, x0 - pad); y0 = Math.Max(0, y0 - pad); x1 = Math.Min(w - 1, x1 + pad); y1 = Math.Min(h - 1, y1 + pad);
        using (var t = b.Clone(new Rectangle(x0, y0, x1 - x0 + 1, y1 - y0 + 1), PixelFormat.Format32bppArgb)) t.Save(outPath, ImageFormat.Png);
        return (x1 - x0 + 1) + "x" + (y1 - y0 + 1);
      }
    }
  }
}
"@
[Cutout]::Run($In, $Out, $Mode, $Longest, $Cx, $Cy, $Cw, $Ch)
