import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";

const tops = [
  ["XS", "44", "86–90", "72–76"],
  ["S", "46", "90–94", "76–80"],
  ["M", "48", "94–98", "80–84"],
  ["L", "50", "98–102", "84–88"],
  ["XL", "52", "102–106", "88–92"],
  ["XXL", "54", "106–110", "92–96"],
];

const pants = [
  ["28", "71", "76–80", "92–96"],
  ["30", "76", "80–84", "96–100"],
  ["32", "81", "84–88", "100–104"],
  ["34", "86", "88–92", "104–108"],
  ["36", "91", "92–96", "108–112"],
];

const shoes = [
  ["40", "25.5"], ["41", "26"], ["42", "26.5"], ["43", "27.5"], ["44", "28"], ["45", "29"],
];

const Table = ({ headers, rows }: { headers: string[]; rows: string[][] }) => (
  <div className="overflow-x-auto rounded-xl border border-border">
    <table className="w-full text-sm">
      <thead className="bg-secondary">
        <tr>{headers.map((h) => <th key={h} className="text-left px-4 py-3 font-semibold">{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-t border-border">
            {row.map((c, j) => <td key={j} className="px-4 py-3 text-muted-foreground">{c}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const SizeGuide = () => (
  <Layout>
    <div className="container mx-auto px-4 py-12 md:py-16 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Таблица размеров</h1>
          <p className="text-muted-foreground">Измеряйте параметры по телу. Если значение между размерами — выбирайте больший.</p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Верх (футболки, рубашки, свитшоты)</h2>
          <Table headers={["Размер", "RU", "Грудь, см", "Талия, см"]} rows={tops} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Брюки и джинсы</h2>
          <Table headers={["Размер (W)", "Талия, см", "Талия по телу, см", "Бёдра, см"]} rows={pants} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Обувь</h2>
          <Table headers={["Размер EU", "Длина стопы, см"]} rows={shoes} />
        </section>

        <section className="bg-card border border-border rounded-2xl p-6">
          <h3 className="font-semibold mb-2">Как правильно измерить</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li><span className="text-foreground">Грудь:</span> по самой выступающей точке, лента горизонтально.</li>
            <li><span className="text-foreground">Талия:</span> по самой узкой части корпуса.</li>
            <li><span className="text-foreground">Бёдра:</span> по самой широкой точке.</li>
            <li><span className="text-foreground">Стопа:</span> от пятки до большого пальца, стоя.</li>
          </ul>
        </section>
      </motion.div>
    </div>
  </Layout>
);

export default SizeGuide;
