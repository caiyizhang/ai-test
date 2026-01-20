/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  corePlugins: {
    // 禁用 preflight 以免与 Ant Design Vue 样式冲突
    // 如果需要 Tailwind 的基础重置，可以设为 true，但可能需要修复 AntD 的一些样式
    preflight: false,
  }
}
