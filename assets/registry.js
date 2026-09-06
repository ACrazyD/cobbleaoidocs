(() => {
  const tools = document.querySelector('[data-registry-tools]');
  if (!tools) return;

  const content = tools.closest('.post-content');
  const sections = [...content.querySelectorAll(':scope > h2')].filter((heading) => heading.textContent.trim() !== 'Namespaces');
  const primaryAliases = {
    ae2cs: 'ae2',
    aerocali: 'aeronautics',
    aeroclaims: 'aeronautics',
    aeroworks: 'aeronautics',
    createaviation: 'create',
    createmonballsoverhaul: 'create',
    createpropulsion: 'create',
    createrailwaysnavigator: 'create',
    createtransmission: 'create',
    mekanismgenerators: 'mekanism',
    apotheosis_create: 'apotheosis',
    apothic_compats: 'apotheosis',
    appflux: 'appliedenergistics2',
    appmek: 'mekanism',
    appliedcooking: 'create',
    appliedcreate: 'create'
  };
  const namespacePattern = /^([\w-]+):/;
  const selected = new Set();
  const sectionsByPrimary = new Map();

  const getNamespace = (section) => section.textContent.trim();
  const getPrimary = (namespace, names) => {
    if (primaryAliases[namespace]) return primaryAliases[namespace];
    if (names.includes(namespace)) return namespace;
    return names
      .filter((name) => namespace.startsWith(name) && namespace.length > name.length)
      .sort((left, right) => right.length - left.length)[0] || namespace;
  };

  const allNames = sections.map(getNamespace);
  const namespaceHeading = [...content.querySelectorAll(':scope > h2')]
    .find((heading) => heading.textContent.trim() === 'Namespaces');
  const namespaceOverview = [];
  let namespaceElement = namespaceHeading;
  while (namespaceElement && namespaceElement !== sections[0]) {
    namespaceOverview.push(namespaceElement);
    namespaceElement = namespaceElement.nextElementSibling;
  }

  sections.forEach((section) => {
    const namespace = getNamespace(section);
    const primary = getPrimary(namespace, allNames);
    if (!sectionsByPrimary.has(primary)) sectionsByPrimary.set(primary, []);
    sectionsByPrimary.get(primary).push({ section, namespace, primary });
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'registry-groups';
  sections[0]?.before(wrapper);

  const primaryNames = [...new Set([...sectionsByPrimary.keys()])];
  const groups = primaryNames.map((primary) => {
    const group = document.createElement('section');
    group.className = 'registry-group';
    group.dataset.primary = primary;
    const heading = document.createElement('h2');
    heading.className = 'registry-group-heading';
    heading.id = `group-${primary.replace(/[^a-z0-9]+/gi, '-')}`;
    heading.textContent = primary;
    group.append(heading);
    wrapper.append(group);
    return group;
  });
  const groupMap = new Map(groups.map((group) => [group.dataset.primary, group]));
  sections.forEach((section) => {
    const entry = [...sectionsByPrimary.values()].flat().find((item) => item.section === section);
    const group = groupMap.get(entry.primary);
    const block = document.createElement('div');
    block.className = 'registry-namespace';
    block.dataset.namespace = entry.namespace;
    const heading = document.createElement('h3');
    heading.textContent = entry.namespace;
    heading.id = section.id;
    block.append(heading);
    let next = section.nextElementSibling;
    while (next && next.tagName !== 'H2') {
      const current = next;
      next = next.nextElementSibling;
      block.append(current);
    }
    section.remove();
    group.append(block);
  });

  const items = [...wrapper.querySelectorAll('li')].filter((item) => namespacePattern.test(item.textContent));
  items.forEach((item) => {
    const value = item.textContent.trim();
    item.dataset.registryId = value;
    item.tabIndex = 0;
    item.setAttribute('role', 'button');
  });

  const search = tools.querySelector('[data-registry-search], .registry-search');
  const status = tools.querySelector('[data-selection-status]');
  const output = tools.querySelector('[data-selection-output]');

  const updateStatus = () => {
    status.textContent = `${selected.size} selected`;
    output.value = `[\n${[...selected].map((id) => `  "${id}"`).join(',\n')}\n]`;
    output.hidden = selected.size === 0;
  };

  const toggleItem = (item) => {
    const value = item.dataset.registryId;
    if (selected.has(value)) {
      selected.delete(value);
      item.classList.remove('is-selected');
    } else {
      selected.add(value);
      item.classList.add('is-selected');
    }
    updateStatus();
  };

  wrapper.addEventListener('click', (event) => {
    const item = event.target.closest('li[data-registry-id]');
    if (item) toggleItem(item);
  });

  wrapper.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const item = event.target.closest('li[data-registry-id]');
    if (!item) return;
    event.preventDefault();
    toggleItem(item);
  });

  search.addEventListener('input', () => {
    const query = search.value.trim().toLowerCase();
    namespaceOverview.forEach((element) => {
      element.hidden = query !== '';
    });
    items.forEach((item) => {
      item.hidden = query !== '' && !item.dataset.registryId.toLowerCase().includes(query);
    });
    [...wrapper.querySelectorAll('.registry-namespace')].forEach((namespace) => {
      namespace.hidden = ![...namespace.querySelectorAll('li')].some((item) => !item.hidden);
    });
    groups.forEach((group) => {
      group.hidden = ![...group.querySelectorAll('.registry-namespace')].some((namespace) => !namespace.hidden);
    });
  });

  tools.querySelector('[data-select-visible]').addEventListener('click', () => {
    items.filter((item) => !item.hidden).forEach((item) => {
      selected.add(item.dataset.registryId);
      item.classList.add('is-selected');
    });
    updateStatus();
  });

  tools.querySelector('[data-clear-selection]').addEventListener('click', () => {
    selected.clear();
    items.forEach((item) => item.classList.remove('is-selected'));
    updateStatus();
  });

  tools.querySelector('[data-copy-selection]').addEventListener('click', async () => {
    if (!selected.size) return;
    await navigator.clipboard.writeText(output.value);
    status.textContent = `${selected.size} selected and copied`;
  });

  updateStatus();
})();
