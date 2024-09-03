import { getUserJWTToken } from "@/utils/chapter/users";

export async function getJobPostPdf(id: string) {
    const token = await getUserJWTToken();
    const response = await fetch(
        process.env.NEXT_PUBLIC_CHAPTER_API_URL! + "/jobs/" + id + "/pdf",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token.value}`,
            },
        }
    );
    if (!response.ok) {
        const msg = await response.json();
        throw new Error(msg?.detail);
    }

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", id);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
