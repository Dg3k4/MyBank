const PinAttention = ({show, animationKey, children}) => {
    return (
        <div className={`pin__attention${show ? "" : " hidden"}`}>
            <div className="pin__attention-pop">
                <span key={`${animationKey}`}>
                    {children}
                </span>
            </div>
        </div>
    );
};

export default PinAttention;