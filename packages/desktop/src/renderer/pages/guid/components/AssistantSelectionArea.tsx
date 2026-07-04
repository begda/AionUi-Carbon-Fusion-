/**
 * @license
 * Copyright 2025 AionUi (aionui.com)
 * SPDX-License-Identifier: Apache-2.0
 */

import styles from '../index.module.css';
import { assistantRuntimeKey, type Assistant } from '@/common/types/agent/assistantTypes';
import { Down, Robot, Search } from '@icon-park/react';
import { Button, Dropdown, Input } from '@arco-design/web-react';
import React, { useMemo, useState } from 'react';
import { resolveAssistantAvatar } from '@/renderer/utils/model/assistantAvatar';
import { useTranslation } from 'react-i18next';

type AssistantSelectionAreaProps = {
  selectedAssistantId?: string | null;
  assistants: Assistant[];
  localeKey: string;
  onSelectAssistant: (assistantId: string) => void;
};

const AssistantSelectionArea: React.FC<AssistantSelectionAreaProps> = ({
  selectedAssistantId,
  assistants,
  localeKey,
  onSelectAssistant,
}) => {
  const { t } = useTranslation();
  const [moreVisible, setMoreVisible] = useState(false);
  const [search, setSearch] = useState('');
  const selectedId = selectedAssistantId || undefined;
  const enabledAssistants = useMemo(
    () =>
      [...assistants]
        .filter((assistant) => assistant.enabled !== false)
        .sort((left, right) => left.sort_order - right.sort_order),
    [assistants]
  );
  const visibleAssistants = useMemo(() => {
    if (enabledAssistants.length <= 5 || !selectedId) {
      return enabledAssistants.slice(0, 5);
    }

    const selectedIndex = enabledAssistants.findIndex((assistant) => assistant.id === selectedId);
    if (selectedIndex < 0 || selectedIndex < 5) {
      return enabledAssistants.slice(0, 5);
    }

    return [...enabledAssistants.slice(0, 4), enabledAssistants[selectedIndex]];
  }, [enabledAssistants, selectedId]);
  const hasOverflow = enabledAssistants.length > visibleAssistants.length;
  const overflowAssistants = useMemo(() => {
    const visibleIds = new Set(visibleAssistants.map((assistant) => assistant.id));
    return enabledAssistants.filter((assistant) => !visibleIds.has(assistant.id));
  }, [enabledAssistants, visibleAssistants]);
  const filteredOverflowAssistants = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return overflowAssistants;
    return overflowAssistants.filter((assistant) => {
      const label = assistant.name_i18n?.[localeKey] || assistant.name;
      return label.toLowerCase().includes(query);
    });
  }, [localeKey, overflowAssistants, search]);

  if (enabledAssistants.length === 0) return null;

  const renderAssistantPill = (assistant: Assistant, testId: string) => {
    const avatar = resolveAssistantAvatar(assistant.avatar);
    const isSelected = selectedId === assistant.id;
    const label = assistant.name_i18n?.[localeKey] || assistant.name;

    return (
      <Button
        key={assistant.id}
        data-testid={testId}
        data-assistant-id={assistant.id}
        data-assistant-backend={assistantRuntimeKey(assistant)}
        data-assistant-selected={isSelected ? 'true' : 'false'}
        type='text'
        className={`!inline-flex !min-w-0 !h-auto !items-center !gap-6px !rounded-999px !border-none !px-12px !py-8px !text-13px transition-all ${
          isSelected ? 'font-600 text-t-primary shadow-sm' : 'text-t-secondary opacity-75 hover:opacity-100'
        }`}
        style={isSelected ? { background: 'var(--bg-base, #fff)' } : { background: 'transparent' }}
        onClick={() => {
          onSelectAssistant(assistant.id);
          setMoreVisible(false);
        }}
      >
        <span className='inline-flex h-20px w-20px items-center justify-center overflow-hidden rounded-999px bg-fill-2'>
          {avatar.kind === 'image' ? (
            <img src={avatar.value} alt='' className='h-full w-full object-contain' />
          ) : avatar.kind === 'emoji' ? (
            <span className={styles.assistantCardEmoji}>{avatar.value}</span>
          ) : (
            <Robot theme='outline' size={14} />
          )}
        </span>
        <span className='max-w-180px truncate whitespace-nowrap'>{label}</span>
      </Button>
    );
  };

  const overflowDroplist = (
    <div
      className='min-w-240px rounded-12px border border-border-2 p-8px shadow-lg'
      style={{ background: 'var(--bg-base, #fff)' }}
    >
      <div className='mb-8px'>
        <Input
          size='small'
          value={search}
          onChange={setSearch}
          prefix={<Search theme='outline' size={14} />}
          placeholder={t('team.create.searchPlaceholder', { defaultValue: 'Search assistants...' })}
        />
      </div>
      <div className='flex max-h-260px flex-col gap-4px overflow-y-auto'>
        {filteredOverflowAssistants.map((assistant) => (
          <div key={assistant.id}>{renderAssistantPill(assistant, `assistant-overflow-${assistant.id}`)}</div>
        ))}
      </div>
    </div>
  );


  const overflowRowlist = (
    <div
      className=' rounded-bl-[24px] rounded-br-[24px] p-2'
      style={{ background: 'var(--bg-base, #fff)' }}
    >
      <div className='mb-8px w-full'>
        <Input
          size='small'
          value={search}
          onChange={setSearch}
          prefix={<Search theme='outline' size={14} />}
          placeholder={t('team.create.searchPlaceholder', { defaultValue: 'Search assistants...' })}
        />
      </div>


      <div className='flex max-h-260px flex-col gap-4px overflow-y-auto flex-wrap rounded-bl-[24px]'>
        {filteredOverflowAssistants.map((assistant) => (
          <div key={assistant.id}>{renderAssistantPill(assistant, `assistant-overflow-${assistant.id}`)}</div>
        ))}
      </div>
    </div>
  );

  return (
    <div className='mt-18px mb-16px w-full'>
      <div className='flex w-full justify-center'>
        {/*liaohui 这里修改首页ai 助手的界面*/}
        <div
          className='inline-flex w-full  items-center rounded-tl-[24px] rounded-tr-[24px] px-6px py-6px'
          style={{ background: 'var(--color-guid-agent-bar, var(--aou-2))' }}
        >
          <div className='flex min-w-0 w-full items-center gap-6px justify-between  '>
            {visibleAssistants.map((assistant) => renderAssistantPill(assistant, `preset-pill-${assistant.id}`))}
          </div>

        </div>

      </div>
      {overflowRowlist}
    </div>
  );
};

export default AssistantSelectionArea;
