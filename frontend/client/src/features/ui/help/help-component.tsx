export function Help(props: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={props.className}>
      Need help?{" "}
      <a href="mailto:info@andreyponomarev.ru" className="link">
        Contact us
      </a>
    </p>
  );
}
