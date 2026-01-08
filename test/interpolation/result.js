const dynamicText = $t('615db57aa314529a');
const greeting = $t("20ffb2cc34318741",[dynamicText]);
const message = $t('47781b8a72bcbb7e') + $t('014ff20aa9078306');

const obj = {
    title: $t('43ab9af06e1e0f0b'),
    desc: $t("4f401e68c89bb21a",[$t('3bdd08adab6ea90b')])
};

function showAlert() {
    alert($t('900c70fa5f7dbc01') + $t('d8c7e04c8e2be23d'));
    console.log($t("9a6ab2a95432add2",[$t('f63206a92a846ff7')]));
}

const template = `
    <div>$t("03ae79409f0c9b52")</div>
`;
