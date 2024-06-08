import BackendPage from "@/views/BackendPage";
import { ComponentProvider } from '../../component/Context';

export default function Home() {

    return (
    <div>
        <ComponentProvider>
            <BackendPage/>
        </ComponentProvider>
    </div>
    );
}