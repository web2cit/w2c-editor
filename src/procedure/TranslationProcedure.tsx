import {
  Card,
  CardHeader,
  CardContent, Checkbox, FormControlLabel, IconButton, Tooltip } from "@mui/material";
import { Delete, Help } from '@mui/icons-material';
import React from "react";
import { useTranslation } from 'react-i18next';
import TemplateFieldOutput from '../TemplateFieldOutput';
import TestFieldOutput from '../TestFieldOutput';
import { Procedure } from '../types';
import { camelToKebabCase } from '../utils';
import ListItemActions from '../ListItemActions';

interface TranslationProcedureProps {
  selections: SelectionStep[];
  transformations: TransformationStep[];
  index: number;
  last?: boolean;
}

function TranslationProcedureComponent(props: TranslationProcedureComponentProps) {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        {t('translation-procedure.label', { index: props.index })}
        <ListItemActions
          keyPrefix="translation-procedure"
          first={props.index === 0}
          last={props.last}
          editable={true}
        />
      </CardHeader>
    </Card>
  )
}

export default TranslationProcedureComponent;