# Comma SaaS - Brand Style Guide

This document outlines the core brand identity, color palette, typography, and UI component styling for the Comma SaaS Agency Reporting & SEO Dashboard based on the initial designs.

## 1. Brand Identity
**Comma** is a high-performance, white-labeled reporting dashboard designed for modern marketing agencies. The design language must communicate:
- **Clarity & Professionalism:** Clean lines, ample whitespace, and lack of clutter.
- **Modernity:** Subtle micro-animations, premium layout structures, and high-contrast typography.
- **Trust:** Data-heavy modules that are easy to parse at a glance.

## 2. Color Palette

### Primary Colors
- **Background (Light Mode):** `#FFFFFF` (Pure White)
- **Background (Subtle App Area):** `#F8FAFC` (Slate 50) - Used for app backgrounds to make pure white cards pop.
- **Accent / Primary Action:** `#E06719` (Vibrant Orange) - Used for primary buttons, active states, and key highlights.
- **Text (Primary):** `#0F172A` (Slate 900) - For headings and high-contrast text.
- **Text (Secondary/Muted):** `#64748B` (Slate 500) - For descriptions, timestamps, and secondary labels.

### Functional Colors
- **Success:** `#22C55E` (Green 500) - For positive ranking trends, successful indexation.
- **Warning/Error:** `#EF4444` (Red 500) - For dropping rankings, deindexation alerts.
- **Borders/Dividers:** `#E2E8F0` (Slate 200) - For subtle separation between elements.

## 3. Typography

The platform utilizes a dual-font system to balance readability with modern flair.

### Headings: **Outfit**
- **Usage:** Page titles, card headers, metric numbers, and primary navigation links.
- **Weights:** SemiBold (600), Bold (700).
- **Styling Example:** `text-3xl font-bold tracking-tight text-slate-900`

### Body: **DM Sans**
- **Usage:** Paragraphs, data tables, UI descriptions, and secondary text.
- **Weights:** Regular (400), Medium (500).
- **Styling Example:** `text-sm text-slate-500 leading-relaxed`

## 4. UI Component Styling

### Buttons
- **Primary Buttons:** Background `#E06719`, Text `#FFFFFF`.
- **Border Radius:** `radius-md` (0.375rem / 6px) to `radius-lg` (0.5rem / 8px).
- *(Note: Initial "pill" designs using 96px radius have been deprecated in favor of a more structured, professional standard radius for B2B dashboards).*
- **Interaction:** Subtle opacity reduction on hover or slight transform translation (`hover:-translate-y-0.5`).

### Cards & Modules (e.g., Kanban Board)
- **Background:** `#FFFFFF`
- **Border:** `1px solid #E2E8F0`
- **Shadow:** `shadow-sm` (subtle shadow for depth)
- **Border Radius:** Less round. Standardized to `0.5rem` (8px) or `0.75rem` (12px) max to maintain a sharp, data-driven look. Avoid extreme rounding.
- **Padding:** Generous padding (`p-6` or `p-8`) to allow data to breathe.

### Navigation (Sidebar)
- **Style:** Clean vertical layout. Active states highlighted with a subtle `#F1F5F9` background and an `#E06719` left border or icon tint.

---
*Note: As the platform evolves into Dark Mode, the palette will invert using deep slates (`#020617` and `#0F172A`) while retaining `#E06719` as the luminous accent.*
