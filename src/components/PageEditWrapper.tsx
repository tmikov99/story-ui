import { useParams } from "react-router-dom";
import PageCreate from "./PageCreate";

export default function PageEditWrapper() {
    const { pageId } = useParams<{ pageId: string }>();
    return <PageCreate pageId={Number(pageId)} />;
};