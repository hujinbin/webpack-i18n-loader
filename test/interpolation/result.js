const dynamicText = $t('a314529aaa0fbe95');
const greeting = $t("ab95eeae64732d39",[dynamicText]);
const message = $t('72bcbb7ecb1f9553') + $t('a90783069450365c');

const obj = {
    title: $t('6e1e0f0b2a8767b4'),
    desc: $t("d114d705dac11170",[$t('ab6ea90b9164b20a')])
};

function showAlert() {
    alert($t('5f7dbc014e6f762d') + $t('8e2be23dd3b81a31'));
    console.log($t("98d2599371f56ad3",[$t('2a846ff73d0af241')]));
}

const template = `
    <div>{$t("9f0c9b52d3da19b8")}</div>
`;
