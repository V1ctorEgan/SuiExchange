import { motion } from "framer-motion";

const Marquee = ({ items, reverse = false }) => {
  return (
    <div className="overflow-hidden py-4">
      <motion.div
        className={`flex gap-8 ${reverse ? "animate-marquee-reverse" : "animate-marquee"}`}
        style={{ width: "fit-content" }}
      >
        {[...items, ...items, ...items].map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 px-6 py-3 rounded-2xl glass border border-border/30 whitespace-nowrap"
          >
            <div className="w-2 h-2 rounded-full bg-primary glow-sm" />
            <span className="text-sm font-medium text-muted-foreground">{item}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
