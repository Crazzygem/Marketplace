# Lookup: Component Mapping (Bootstrap → shadcn)

| shadcn Component | Current Bootstrap | Angular Implementation |
|------------------|------------------|----------------------|
| Card | card, card-header, card-body, card-footer | Reuse with CSS variable classes |
| Button | btn, btn-* | Extend with semantic variants |
| Input | form-control | Add focus-ring, error states |
| Select | form-select | Add trigger pattern |
| Badge | badge | Use semantic color variants |
| Table | table | Add consistent padding, hover |
| Alert | alert | Map to semantic variants |
| Avatar | Custom avatar div | Create reusable component |
| Tabs | nav-pills | Convert to Tabs pattern |
| Dialog | modal | Keep, add accessibility |
| Separator | \<hr\> | Replace with styled component |

**Key Points**:
- Reuse Bootstrap structure with shadcn colors
- Use CSS variable overrides in `tokens.css`
- Create semantic variants for buttons/badges/alerts
- Pattern: Bootstrap classes + semantic tokens

**Reference**: shadcn component gallery
