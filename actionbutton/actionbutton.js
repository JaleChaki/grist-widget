function ready(fn) {
  if (document.readyState !== 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

let data = {
  status: 'waiting',
  result: null,
  inputs: [{
    description: null,
    button: null,
    actions: null,
  }],
  desc: null
}

ready(() => {
    grist.ready({ requiredAccess: 'full', columns: [ { name: 'ButtonDescriptor', title: 'Button descriptors' } ] });
    grist.onRecord((record, mappings) => {
        const root = document.body.children[0];
        root.innerHTML = '';
        column = mappings['ButtonDescriptor'];
        console.log(mappings);
        console.log('COLUMN ' + column + ' DESC V');

        let buttonInfos = record[column];
        console.log(record);
        if(!Array.isArray(buttonInfos)) {
            buttonInfos = [ buttonInfos ];
        }

        buttonInfos.forEach(info => {
            console.log(info);

            let button = document.createElement("button");
            root.appendChild(button);
            button.innerText = info['button'];
            button.onclick = e => {
                applyActions(info['actions'])
            }
            root.appendChild(button);
        });
    });
});

async function applyActions(actions) {
  data.results = "Working...";
  try {
    await grist.docApi.applyUserActions(actions);
    data.message = 'Done';
  } catch (e) {
    data.message = `Please grant full access for writing. (${e})`;
  }
}