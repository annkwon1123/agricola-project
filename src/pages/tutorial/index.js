import GamePage from "@/views/GamePage";
import { ComponentProvider } from '../../component/Context';
import { ReceiveComponentProvider } from '../../component/ReceiveContext';

export default function Home() {

    return (
    <div>
        <ComponentProvider>
            <ReceiveComponentProvider>
                <GamePage/>
            </ReceiveComponentProvider>
        </ComponentProvider>
    </div>
    );
}