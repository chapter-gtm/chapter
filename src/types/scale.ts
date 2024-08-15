export const ScaleLabel: { [key: string]: { label: string; color: string } } = {
    Low: { label: "Low", color: "bg-red-100" },
    Medium: { label: "Medium", color: "bg-yellow-100" },
    High: { label: "High", color: "bg-green-100" },
};

export enum Scale {
    LOW = "Low",
    MEDIUM = "Medium",
    HIGH = "High",
}
