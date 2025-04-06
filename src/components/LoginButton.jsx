import styled from "styled-components";
import PropTypes from "prop-types";

const Button = ({ onClick }) => {
    return (
        <StyledWrapper>
            <button
                className="button"
                style={{ verticalAlign: "middle" }}
                onClick={onClick}
            >
                <span className="text-xl font-bold">Login</span>
            </button>
        </StyledWrapper>
    );
};

Button.propTypes = {
    onClick: PropTypes.func.isRequired,
};

const StyledWrapper = styled.div`
    .button {
        display: inline-block;
        border-radius: 7px;
        border: none;
        background: #000000;
        color: white;
        font-family: inherit;
        text-align: center;
        font-size: 12px;
        box-shadow: 0px 14px 56px -11px #000000;
        width: 12em;
        padding: 0.6em;
        transition: all 0.4s;
        cursor: pointer;
    }

    .button span {
        cursor: pointer;
        display: inline-block;
        position: relative;
        transition: 0.4s;
    }

    .button span:after {
        content: ":)";
        position: absolute;
        opacity: 0;
        top: 0;
        right: -20px;
        transition: 0.7s;
    }

    .button:hover span {
        padding-right: 3.55em;
    }

    .button:hover span:after {
        opacity: 4;
        right: 0;
    }
`;

export default Button;
