import React from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from '@/components/ui/card';

/**
 * Theme Toggle Showcase
 * Demonstrates all available theme toggle variants
 */
export const ThemeToggleShowcase: React.FC = () => {
  const { isDark, theme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Dark/Light Mode Toggle</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Current mode: <span className="font-semibold">{theme.toUpperCase()}</span> ({isDark ? '🌙' : '☀️'})
          </p>
        </div>

        {/* Variants Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Icon Variant */}
          <Card className="p-8">
            <h2 className="text-xl font-semibold mb-6">Icon Variant</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Compact icon-only toggle. Perfect for navbars and tight spaces.
            </p>
            <div className="flex gap-4 items-center">
              <ThemeToggle variant="icon" />
              <ThemeToggle variant="icon" className="rounded-lg" />
            </div>
            <p className="text-xs text-gray-500 mt-4">
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                &lt;ThemeToggle variant="icon" /&gt;
              </code>
            </p>
          </Card>

          {/* Button Variant */}
          <Card className="p-8">
            <h2 className="text-xl font-semibold mb-6">Button Variant</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Styled button with optional label. Great for settings or preferences.
            </p>
            <div className="flex flex-col gap-4">
              <ThemeToggle variant="button" />
              <ThemeToggle variant="button" showLabel />
            </div>
            <p className="text-xs text-gray-500 mt-4">
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                &lt;ThemeToggle variant="button" showLabel /&gt;
              </code>
            </p>
          </Card>

          {/* Pill Variant */}
          <Card className="p-8">
            <h2 className="text-xl font-semibold mb-6">Pill/Switch Variant</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Modern toggle switch style. Most visually distinct and user-friendly.
            </p>
            <div className="flex gap-4 items-center">
              <ThemeToggle variant="pill" />
            </div>
            <p className="text-xs text-gray-500 mt-4">
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                &lt;ThemeToggle variant="pill" /&gt;
              </code>
            </p>
          </Card>

          {/* Custom Styling */}
          <Card className="p-8">
            <h2 className="text-xl font-semibold mb-6">Custom Styling</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Use the className prop to customize appearance.
            </p>
            <div className="flex gap-4 items-center flex-wrap">
              <ThemeToggle variant="icon" className="p-3 bg-orange-500/20 hover:bg-orange-500/30 rounded-full" />
              <ThemeToggle variant="button" className="bg-blue-500 hover:bg-blue-600 text-white" />
            </div>
            <p className="text-xs text-gray-500 mt-4">
              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
                &lt;ThemeToggle className="..." /&gt;
              </code>
            </p>
          </Card>
        </div>

        {/* Features */}
        <div className="mt-12 bg-blue-50 dark:bg-blue-950/30 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold mb-4">Features</h3>
          <ul className="space-y-2 text-sm">
            <li>✓ Smooth animations and transitions</li>
            <li>✓ Persists user preference in localStorage</li>
            <li>✓ Respects system color scheme preference</li>
            <li>✓ Works seamlessly with Tailwind dark mode</li>
            <li>✓ Accessible with ARIA labels</li>
            <li>✓ Three beautiful variants to choose from</li>
            <li>✓ Customizable with className prop</li>
          </ul>
        </div>

        {/* Usage Guide */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold mb-4">How to Use</h3>
          <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
            <pre className="text-sm overflow-x-auto">
{`import { ThemeToggle } from '@/components/ThemeToggle';

export function MyComponent() {
  return (
    <div>
      {/* Icon variant - use in navbar */}
      <ThemeToggle variant="icon" />
      
      {/* Button variant - use in settings */}
      <ThemeToggle variant="button" showLabel />
      
      {/* Pill variant - use as main toggle */}
      <ThemeToggle variant="pill" />
      
      {/* With custom styling */}
      <ThemeToggle 
        variant="button" 
        className="bg-orange-500 hover:bg-orange-600" 
      />
    </div>
  );
}`}
            </pre>
          </div>
        </div>

        {/* Integration in Navbar Example */}
        <div className="mt-12 bg-green-50 dark:bg-green-950/30 p-6 rounded-lg border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold mb-4">Already Integrated in Navbar</h3>
          <p className="text-sm mb-4">
            The Navbar component already has the theme toggle integrated! You can see it in action at the top right of the page.
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            The toggle uses the <code className="bg-green-100 dark:bg-green-900 px-2 py-1 rounded">icon</code> variant by default and appears next to notifications and cart icons.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThemeToggleShowcase;
