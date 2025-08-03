import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { useThemeStore } from "../store/theme";
import { Sun, Moon } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Example() {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const { data } = useQuery({
    queryKey: ["rates"],
    queryFn: () =>
      fetch("https://api.frankfurter.app/latest?from=EUR&to=USD,GBP").then((r) =>
        r.json()
      ),
  });

  const rates = data?.rates ? Object.entries(data.rates) : [];

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-900 transition-colors"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.h2 layout className="text-3xl font-bold text-gray-900 dark:text-gray-100">
        Welcome
      </motion.h2>
      <Button onClick={() => toast.success("Clicked!")}>Click me</Button>
      <Button variant="ghost" onClick={toggleTheme} className="flex items-center gap-2">
        {theme === "light" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
        Toggle Theme
      </Button>
      <motion.ul
        layout
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
        className="mt-4 space-y-2"
      >
        {rates.map(([code, value]) => (
          <motion.li
            key={code}
            layout
            variants={{ hidden: { opacity: 0, y: -5 }, visible: { opacity: 1, y: 0 } }}
            className="text-gray-700 dark:text-gray-300"
          >
            1 EUR = {value} {code}
          </motion.li>
        ))}
      </motion.ul>
    </motion.div>
  );
}
