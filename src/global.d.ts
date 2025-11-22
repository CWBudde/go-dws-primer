interface DWScriptError {
  type?: string;
  message?: string;
  line?: number;
  column?: number;
  source?: string | null;
  details?: unknown;
}

interface DWScriptResult {
  success: boolean;
  output?: string;
  errors?: DWScriptError[];
  warnings?: string[];
  executionTime?: number;
  wasmExecutionTime?: number;
}

interface DWScriptHandlers {
  onOutput?: (text: string) => void;
  onError?: (error: DWScriptError) => void;
  onInput?: () => string;
}

interface DWScriptAPI {
  init: (handlers: DWScriptHandlers) => Promise<void>;
  eval: (code: string, options?: unknown) => Promise<DWScriptResult> | DWScriptResult;
  compile: (code: string, cacheKey?: string | null) => Promise<unknown> | unknown;
  run: (programRef: unknown) => Promise<DWScriptResult> | DWScriptResult;
  dispose?: () => void;
  version?: () => unknown;
}

declare class Go {
  importObject: WebAssembly.Imports;
  run: (instance: WebAssembly.Instance) => Promise<void>;
}

declare interface Window {
  Go?: typeof Go;
  DWScript?: {
    new (): DWScriptAPI;
  };
  executeDWScript?: (code: string) => Promise<DWScriptResult>;
}

export {};
