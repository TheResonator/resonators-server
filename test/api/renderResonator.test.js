import _ from 'lodash';
import generateFixtures from '../dbFixtures/fixtureGenerator';
import {assert} from 'chai';
import supertestWrapper from '../api/supertestWrapper';

describe('render resonator', () => {
    let status, text, resonator, userLogin;

    beforeEach(async () => {
        ({ userLogin, resonator } = await generateFixtures().preset1());

        const response = await supertestWrapper({
            method: 'get',
            url: `/api/reminders/${resonator.id}/render`
        });

        ({status, text} = response);
    });

    it('status 200', () => {
        assert.equal(status, 200);
    });

    it('render title', () => {
        assert.include(text, resonator.title);
    });

    it('render the first question', () => {
        const questions = resonator.questions.map(q => q.question);
        const question = questions[0];
        assert.include(text, question.description);

        question.answers.forEach(a => {
            assert.include(text, a.body, 'must include the answer body');
            assert.notInclude(text, '/submit', 'must not include the answers link, since it is a preview mode');
        });
    });

    it('do not render the unsubscribe link', () => {
        assert.notInclude(text, 'unsubscribe');
    });

    it('render image', () => {
        assert.include(text, '<img src="a link"')
    });

    it('dir=ltr', () => {
        assert.include(text, 'dir="ltr"');
    });

    it('should display body with dir=rtl for hebrew resonators', async () => {
        const [ resonator ] = await generateFixtures().generateResonator({
            content: 'אחת ab',
            description: 'שתיים ab'
        }).done();

        const response = await supertestWrapper({
            method: 'get',
            url: `/api/reminders/${resonator.id}/render`
        });

        assert.include(response.text, 'dir="rtl"');
    });
});
