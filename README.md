# Foldable

Fully automated and animated `Collapse` primitive.

- 🚀 Based on CSS transition, working as fast as possible
- 👩‍🔬 Automatic height measurement even for such complex cases as code split content
- 📦 Composable API, simple yet powerful
- 🔋 Batteries included, just ~~add water~~ provide children
- 🤖 Powered by state machines, all animations are reversible
- 👩‍👧 Small - 1kb (even before Gzip, if you subtract tslib)

## Instalation

```bash
npm add @theuiteam/foldable
```

# Example

- [simple accordion](https://codesandbox.io/s/theuiteam-foldable-pk6bi6?file=/src/App.tsx), codesandbox

Works for the majority of possible case

```tsx
import {FoldableSection} from "@theuiteam/foldable";

<button onClick={() => setOpen(!isOpen)}>Toggle</button>
// just tell it when it's time to be open
<FoldableSection open={isOpen}>
    {/*this content will NOT BE rendered/accessible for closed sections*/}
    <AnyContent/>
    <EvenLazyLoadedComponents/>
</FoldableSection>
```

## API

| Prop               | Type                                | Description                                    |
| ------------------ | ----------------------------------- | ---------------------------------------------- |
| open               | boolean                             | Control expanded/collapsed state               |
| transitionDuration | number                              | Time for animation, default 300ms              |
| [keepContent]      | boolean                             | Renders content even in hidden state           |
| [controlProperty]  | height, max-height, custom variable | Controls how height is set, default max-height |

## Configuring animations

> styles used by Foldable will be created only when needed, which makes them
> more _specific_ than styles you might create

There are 3 ways to configure animation

- specify style prop

```tsx
<FoldableSection
  // inline styles are always more specific
  style={{ transitionTimingFunction: 'ease-in' }}
/>
```

- specify className

```tsx
<FoldableSection
  // could configure only non-conflicting props (or do !important)
  className={ClassWithTransitionTimingFunction}
/>
```

- override classes

```tsx
<FoldableSection
  // out-out default configuration
  animationClassName={doWhatEverYouWant}
/>
```

## Advanced usage

Foldable is split into two pieces

- Measurer, this is the "core" functionality
- Measusable, which implementation can be replaced

> 💡 Usecase: For example one can await for all images inside to be loaded, or at least have known dimensions

```tsx
const MyCollapsible = ({children, open}) => (
    <MeasurableSection open={open}>
        ({display, prepare, onReady}) => (
        <>
            // display children when told
            {display && children}
            // call measuringCallback to indicate readyness
            {prepare && <CallThisWhenYouAreReady cb={onReady}/>}
        </>
        )}
    </MeasurableSection>
)
```

# See also

- https://github.com/kunukn/react-collapse - similar package with less functionality

# License

MIT
