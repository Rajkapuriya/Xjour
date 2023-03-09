import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import Button from "@mui/material/Button";
import { Tooltip, tooltipClasses } from "@mui/material";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RemoveIcon from "@mui/icons-material/Remove";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";

import isTypeValid from "../../utils/typeChecker";

const theme = createTheme({
  palette: {
    background: {
      cursor: "unset !important",
    },
  },
});

const tooltipStyles = {
  popper: {
    sx: {
      [`& .${tooltipClasses.tooltip}`]: {
        padding: "12px 16px",
        fontSize: "16px",
      },
    },
  },
};

export function MuiButton(props = {}) {
  return (
    <Tooltip title={props.tooltipText || ""}>
      <Button
        variant={props.variant}
        disabled={props.disabled}
        startIcon={props.startIcon}
        endIcon={props.endIcon}
        className={props.className}
        {...props.additionalProps}
      >
        {props.children}
      </Button>
    </Tooltip>
  );
}

export function MuiTextField(props = {}) {
  return (
    <TextField
      label={isTypeValid("string", props.label) ? props.label : "Label"}
      variant={
        isTypeValid("string", props.variant) ? props.variant : "outlined"
      }
      value={
        isTypeValid(["string", "boolean", "number"], props.value)
          ? props.value
          : ""
      }
      {...props.additionalProps}
    />
  );
}

export function MuiDatePicker(props = {}) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterMoment}
      {...props.additionalLocalizationProviderProps}
    >
      <Stack spacing={3}>
        <DatePicker
          label={
            isTypeValid("string", props.label) ? props.label : "Date Picker"
          }
          value={
            isTypeValid(["string", "number"], props.value)
              ? props.value
              : Date.now()
          }
          components={{
            RightArrowIcon: null,
          }}
          renderInput={(params) => <TextField {...params} />}
          {...props.additionalDatePickerProps}
        />
      </Stack>
    </LocalizationProvider>
  );
}

export function MuiDateTimePicker(props) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterMoment}
      {...props.additionalLocalizationProviderProps}
    >
      <Stack spacing={3}>
        <DateTimePicker
          label={props?.label === undefined ? "Date Time Picker" : props.label}
          value={props?.value === undefined ? Date.now() : props.value}
          components={{
            RightArrowIcon: null,
          }}
          renderInput={(params) => <TextField {...params} />}
          {...props.additionalDateTimerPickerProps}
        />
      </Stack>
    </LocalizationProvider>
  );
}

export function MuiMenuItem(props = {}) {
  return (
    <MenuItem
      value={
        isTypeValid(["string", "boolean", "number", "null"], props.value)
          ? props.value
          : ""
      }
      {...props.additionalProps}
    >
      {props.children}
    </MenuItem>
  );
}

export function MuiSelect(props = {}) {
  const menuItems = isTypeValid("array", props.menuItems)
    ? props.menuItems
    : [];

  return (
    <FormControl fullWidth className={props.className}>
      <InputLabel id="select-label">
        {isTypeValid("string", props.label) ? props.label : "Label"}
      </InputLabel>
      <Select
        labelId="select-label"
        label={isTypeValid("string", props.label) ? props.label : "Label"}
        value={
          isTypeValid(["string", "boolean", "number"], props.value)
            ? props.value
            : ""
        }
        {...props.additionalSelectProps}
      >
        {menuItems.map((menuItem, index) => {
          return (
            <MenuItem
              key={menuItem?.id || index}
              value={menuItem?.value || index}
              {...menuItem.additionalMenuItemProps}
            >
              {menuItem.children}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

export function MuiSwitch(props = {}) {
  return (
    <Switch
      checked={props?.checked ? props.checked : false}
      {...props.additionalProps}
    />
  );
}

export function MuiAccordion(props = {}) {
  const CustomAccordionSummary = styled((props) => {
    return (
      <AccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
        {...props}
      />
    );
  })(({ theme }) => ({
    backgroundColor: "rgba(0, 0, 0, .03)",
    "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
      transform: "rotate(90deg)",
    },
    "& .MuiAccordionSummary-content": {
      marginLeft: theme.spacing(1),
    },
  }));

  return (
    <ThemeProvider theme={theme}>
      <Accordion
        expanded={props?.expanded || false}
        {...props.additionalAccordionProps}
      >
        {props.hasCustomSummary && (
          <CustomAccordionSummary
            onClick={() => props.handlers.handleAccordionExpansion()}
            {...props.additionalAccordionSummaryProps}
          >
            <Typography {...props.additionalAccordionHeadingProps}>
              {props.accordionHeading}
            </Typography>
          </CustomAccordionSummary>
        )}

        {!props.hasCustomSummary && (
          <AccordionSummary
            sx={{
              cursor: (theme) => theme.palette.background.cursor,
            }}
            expandIcon={
              <>
                <ExpandMoreIcon
                  sx={{
                    cursor: "pointer",
                  }}
                  onClick={() => props.handlers.handleAccordionExpansion()}
                  {...props.additionalExpandIconProps}
                />
                <MoreVertIcon {...props.additionalMoreVertIconProps} />
              </>
            }
            {...props.additionalAccordionSummaryProps}
          >
            <Typography {...props.additionalAccordionHeadingProps}>
              {props.accordionHeading}
            </Typography>
            {props.headerRemoveIcon && (
              <RemoveIcon
                onClick={() => props.handlers.handleHeaderRemoveIconClick()}
                {...props.additionalAccordionRemoveIconProps}
              />
            )}
          </AccordionSummary>
        )}

        <AccordionDetails {...props.additionalAccordionDetailsProps}>
          {props.accordionDetails || props.children}
        </AccordionDetails>
      </Accordion>
    </ThemeProvider>
  );
}
