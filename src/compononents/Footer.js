import React from "react";
import packageJson from "../../package.json";

function Footer() {
  return (
    <footer>
      <div className="footer">
        <p>
          Developed by Mustafa Evleksiz - 2025 - v{packageJson.version}
        </p>
        <p>
          Exchange rates from{' '}
          <a href="https://frankfurter.dev" target="_blank" rel="noreferrer">
            frankfurter.dev
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
