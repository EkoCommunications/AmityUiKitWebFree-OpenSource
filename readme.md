# Amity UI-Kit for Web

## Getting Started

### Installation

Install Amity UI-Kit using either npm or yarn:

```sh
npm install --save @amityco/ui-kit
```

or

```sh
yarn add @amityco/ui-kit
```

### Documentation

For detailed usage and API references, visit our [official documentation](https://docs.amity.co) or contact our support team at **developers@amity.co**.

---

## Setting Up UI-Kit

To integrate Amity UI-Kit into your application, follow these steps:

1. **Import the main UI-Kit styles** (Required)  
   Add the following import statement in your main application file:

   ```js
   import '@amityco/ui-kit/dist/index.css'; // **Required**
   ```

2. **Customize UI-Kit (Optional)**  
   If you want to customize component styles, create a configuration file named `amity-uikit.config.json` and define your theme colors.

3. **Wrap your application with `<AmityUiKitProvider>`**  
   In your main application component, wrap your content with `AmityUiKitProvider` and pass the required configurations.

---

### Example Integration

```jsx
import React from 'react';
import "@amityco/ui-kit/dist/index.css";
import amityConfig from './amity-uikit.config.json';
import { AmityUiKitProvider, AmityUiKitSocial } from '@amityco/ui-kit';

const App = () => {
  return (
    <AmityUiKitProvider
      apiKey={apiKey}
      userId={userId}
      displayName={displayName}
      apiEndpoint={apiEndpoint}
      apiRegion={apiRegion}
      configs={amityConfig as Config}
    >
        <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "100vw",
          height: "100dvh",
        }}
        >
            <AmityUiKitSocial />
        </div>
    </AmityUiKitProvider>
  );
};

export default App;
```

---

## Contributing

We welcome contributions! Please check our [contributing guide](https://github.com/EkoCommunications/AmityUiKitWeb/blob/develop/CONTRIBUTING.md) for details.
