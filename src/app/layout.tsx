import "./globalStyles.scss";

interface RootLayoutProps {
  children: JSX.Element;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html>
      <head></head>
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
