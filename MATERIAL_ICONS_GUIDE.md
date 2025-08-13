# Material Icons Guide

This application now uses Google Material Icons consistently throughout all components. Here's how to use them:

## MaterialIcon Component

The `MaterialIcon` component is located at `src/components/ui/MaterialIcon.jsx` and provides a consistent way to use Material Icons.

### Basic Usage

```jsx
import MaterialIcon from '@/components/ui/MaterialIcon';

// Basic usage
<MaterialIcon icon="home" />

// With size
<MaterialIcon icon="settings" size={24} />

// With variant
<MaterialIcon icon="person" variant="filled" size={20} />

// With custom styling
<MaterialIcon icon="favorite" size={32} className="text-red-500" />
```

### Props

- `icon` (string, required): The Material Icon name (e.g., "home", "settings", "person")
- `variant` (string, optional): Icon variant - "filled", "outlined", "round", "sharp", "two-tone" (default: "filled")
- `size` (number, optional): Icon size in pixels (default: 24)
- `className` (string, optional): Additional CSS classes
- `...props`: Any other props are passed to the underlying span element

### Available Variants

1. **filled** - Solid filled icons (default)
2. **outlined** - Outlined icons
3. **round** - Rounded corners
4. **sharp** - Sharp corners
5. **two-tone** - Two-tone colored icons

### Common Icon Names

Here are some commonly used Material Icon names:

#### Navigation
- `menu` - Hamburger menu
- `close` - Close/X button
- `arrow_back` - Back arrow
- `arrow_forward` - Forward arrow
- `chevron_left` - Left chevron
- `chevron_right` - Right chevron
- `keyboard_arrow_up` - Up arrow
- `keyboard_arrow_down` - Down arrow

#### Actions
- `add` - Plus/add
- `edit` - Edit/pencil
- `delete` - Delete/trash
- `save` - Save
- `search` - Search magnifying glass
- `filter_list` - Filter
- `sort` - Sort
- `more_vert` - Three dots menu

#### Content
- `home` - Home
- `person` - Person/user
- `people` - Multiple people
- `email` - Email
- `phone` - Phone
- `location_on` - Location pin
- `business` - Business/building
- `settings` - Settings/gear

#### Status
- `check` - Checkmark
- `error` - Error/X
- `warning` - Warning
- `info` - Information
- `help` - Help/question mark
- `visibility` - Eye (visible)
- `visibility_off` - Eye with slash (hidden)

#### Data
- `analytics` - Analytics/chart
- `date_range` - Calendar
- `schedule` - Clock/time
- `flag` - Flag
- `star` - Star
- `favorite` - Heart
- `bookmark` - Bookmark

### Examples in Components

#### Navigation
```jsx
<MaterialIcon icon="menu" size={20} />
```

#### Table Sorting
```jsx
<MaterialIcon icon="unfold_more" size={12} />
<MaterialIcon icon="keyboard_arrow_up" size={12} />
<MaterialIcon icon="keyboard_arrow_down" size={12} />
```

#### Badge Icons
```jsx
<MaterialIcon icon="directions_car" size={12} />
<MaterialIcon icon="home" size={12} />
<MaterialIcon icon="business" size={12} />
```

#### Actions
```jsx
<MaterialIcon icon="more_vert" size={20} />
<MaterialIcon icon="close" size={16} />
```

### Testing Icons

You can use the `IconTest` component (`src/components/ui/IconTest.jsx`) to test different icons, variants, and sizes. Simply import and use it in any page to see all available options.

### Migration from Other Icon Libraries

The following icon libraries have been replaced:
- `react-icons/fa` (Font Awesome)
- `react-icons/md` (Material Design Icons)
- `react-icons/bs` (Bootstrap Icons)
- `react-icons/lu` (Lucide Icons)
- `react-icons/rx` (Radix Icons)
- `@mui/icons-material` (Material-UI Icons)

All icons now use the consistent `MaterialIcon` component with Google Material Icons.

### Finding Icon Names

You can browse all available Material Icons at: https://fonts.google.com/icons

Simply search for the icon you want and use the name shown on the website (e.g., "home", "settings", "person", etc.). 