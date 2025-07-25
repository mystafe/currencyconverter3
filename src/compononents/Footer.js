import React from "react";
import { useTranslation } from 'react-i18next';
import packageJson from "../../package.json";

function Footer() {
  const { t } = useTranslation();
  return (
    <footer>
      <div className="footer">
        <p>
          Developed by Mustafa Evleksiz - 2025 - v{packageJson.version}
        </p>
        <p className="dataSources">
          {t('exchange_rates_from')} {" "}
          <a href="https://frankfurter.dev" target="_blank" rel="noreferrer">
            frankfurter.dev
          </a>{" | "}
          {t('commodities_from')} {" "}
          <a
            href="https://openexchangerates.org"
            target="_blank"
            rel="noreferrer"
          >
            openexchangerates.org
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
