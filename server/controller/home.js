import { Get } from 'monking';
import { view } from 'monking-react-render';

export default class Screenshot {
    @Get('/diarymark')
    @view('/diarymark')
    async screenshot (render) {
        render();
    }
}
