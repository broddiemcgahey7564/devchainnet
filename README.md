<!--
  CAUTION: This file is automatically generated. Do not edit it manually!
  To adjust it, change the sdk-readme code generator or its template
-->
<div align="center">

  <h1 align="center">DevChainNet NPM Package</h1>

  <div align="center">
    <a align="center" href="https://devchain.net" target="_blank">
      <img src="public/favicon.ico" height="200" />
    </a>
  </div>

  <br />

  <a align="center" href="https://devchain.net" target="_blank">
    <img src="https://discord.gg/9Jt3w3xvx8" alt="" />
  </a>

  <a href="https://discord.gg/9Jt3w3xvx8" target="_blank">
    <img alt="Join the DevChainNet DAO on Discord" src="https://img.shields.io/discord/819584798443569182?color=7289DA&label=Discord&logo=discord&logoColor=ffffff" />
  </a>
  <a href="https://docs.devchain.net" target="_blank">
    <img alt="Check the docs" src="https://img.shields.io/badge/Docs-Full Documentation-21BF96?style=flat&logo=gitbook&logoColor=ffffff" />
  </a>
  <a href="https://twitter.com/DevChainNet" target="_blank">
    <img alt="Twitter URL" src="https://img.shields.io/twitter/url?url=https%3A%2F%2Fdevchainnet.com2?color=7289DA">
  </a><br/>
    <img alt="npm" src="https://img.shields.io/npm/v/devchainnet?label=version" />
    <img alt="github" src="https://img.shields.io/github/last-commit/DevChainNet/DevChainNet" />
    <img alt="bundlephobia" src="https://img.shields.io/bundlephobia/minzip/DevChainNet" />
  <p>
  </p>
  <h3>What is devchainnet?</h3>
  <br />
  <p>
    devchainnet is a React components library (NPM Package) for building full stack web3 applications with minimal 3rd party. <br /><br /> Developer Chain's goal is to create reliable, stable working and easy to integrate components with minimal 3rd party packages. Altough web3 is an amazing technology, it comes with some complexity which exhausts developers. Don't worry, thats why we have created the Developer Chain Network.
  </p>
  <br/>
</div>

---

**Features**:

- Advanced UI components for your web3 applications
- Exceptionally simple to integrate
- Stable & Realiable with minimal 3rd party modules
- Web3 wallet utilities (connect/login/sign)
- Tools to help you simplify your development

... and much more. Check the [official DevChainNet docs](https://docs.devchain.net/) for more details.

# 🚀 Quick start

If you're new to Developer Chain Network, check the [quickstart guide in the official docs](https://docs.devchain.net/quick-start) on how to get started.

## 1. Install DevChainNet

Integrate the DevChainNet SDK into your JavaScript (React/Next.js) project through the npm module.

Install the package via `npm`:

```shell
$ npm install devchainnet
```

Adding DevChainNet components to your frontend project is easy

```javascript
import { Swap, Graph } from 'devchainnet';

<Swap baseURL="https://api.devchain.net/v1/swap" />;
```

> **⚠️ Warning**: You need to add your 0x API key if you use their endpoint directly from your front end