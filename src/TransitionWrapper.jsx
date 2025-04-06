import { motion, AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";

const transitionVariants = {
    initial: { opacity: 0, x: -100 },
    enter: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
};

const TransitionWrapper = ({ children }) => {
    return (
        <AnimatePresence>
            <motion.div
                variants={transitionVariants}
                initial="initial"
                animate="enter"
                exit="exit"
                transition={{ duration: 0.5 }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};

TransitionWrapper.propTypes = {
    children: PropTypes.node.isRequired,
};

export default TransitionWrapper;
