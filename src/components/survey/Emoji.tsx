import React from 'react';

interface EmojiProps {
    label?: string;
    symbol: string;
}

export default function Emoji( props : EmojiProps) {
    return (
        <span
            className="emoji"
            role="img"
            aria-label={props.label ? props.label : ""}
            aria-hidden={props.label ? "false" : "true"}
        >
            {props.symbol}
        </span>
    );
}
